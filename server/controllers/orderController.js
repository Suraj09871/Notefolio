const Order = require("../models/Order")
const Note = require("../models/Note")
const User = require("../models/User")

// Create a new order
exports.createOrder = async (req, res) => {
  try {
    const { items, couponCode } = req.body
    const userId = req.user.id

    // Validate items
    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No items provided",
      })
    }

    // Fetch note details and calculate totals
    let subtotal = 0
    const orderItems = []

    for (const item of items) {
      const note = await Note.findById(item.noteId)

      if (!note) {
        return res.status(404).json({
          success: false,
          message: `Note with ID ${item.noteId} not found`,
        })
      }

      orderItems.push({
        noteId: note._id,
        title: note.title,
        price: note.price,
      })

      subtotal += note.price
    }

    // Apply discount if coupon is provided
    let discount = 0
    if (couponCode) {
      // In a real application, you would validate the coupon code here
      // For demo purposes, we'll use fixed discount values
      switch (couponCode) {
        case "NEW10":
          discount = subtotal * 0.1 // 10% discount
          break
        case "STUDENT20":
          discount = subtotal * 0.2 // 20% discount
          break
        case "BUNDLE15":
          if (items.length >= 3) {
            discount = subtotal * 0.15 // 15% discount for 3+ items
          }
          break
        default:
          return res.status(400).json({
            success: false,
            message: "Invalid coupon code",
          })
      }
    }

    // Calculate GST (18%)
    const gst = (subtotal - discount) * 0.18

    // Calculate total
    const total = subtotal - discount + gst

    // Create order
    const order = new Order({
      userId,
      items: orderItems,
      subtotal,
      discount,
      couponCode: discount > 0 ? couponCode : null,
      gst,
      total,
      status: "pending",
      paymentStatus: "pending",
    })

    await order.save()

    res.status(201).json({
      success: true,
      data: {
        orderId: order._id,
        items: order.items,
        subtotal: order.subtotal,
        discount: order.discount,
        gst: order.gst,
        total: order.total,
        status: order.status,
        paymentStatus: order.paymentStatus,
      },
    })
  } catch (error) {
    console.error("Create order error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to create order",
      error: error.message,
    })
  }
}

// Get order details
exports.getOrderDetails = async (req, res) => {
  try {
    const { orderId } = req.params

    const order = await Order.findById(orderId)

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      })
    }

    // Check if the order belongs to the logged-in user
    if (order.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access to order details",
      })
    }

    res.status(200).json({
      success: true,
      data: order,
    })
  } catch (error) {
    console.error("Get order details error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to fetch order details",
      error: error.message,
    })
  }
}

// Get order history
exports.getOrderHistory = async (req, res) => {
  try {
    const userId = req.user.id

    const orders = await Order.find({ userId }).sort({ createdAt: -1 })

    res.status(200).json({
      success: true,
      data: orders,
    })
  } catch (error) {
    console.error("Get order history error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to fetch order history",
      error: error.message,
    })
  }
}

// Cancel order
exports.cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.params

    const order = await Order.findById(orderId)

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      })
    }

    // Check if the order belongs to the logged-in user
    if (order.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access to cancel order",
      })
    }

    // Check if order can be cancelled
    if (order.status !== "pending" && order.status !== "processing") {
      return res.status(400).json({
        success: false,
        message: "Order cannot be cancelled at this stage",
      })
    }

    // Update order status
    order.status = "cancelled"

    // If payment was made, initiate refund
    if (order.paymentStatus === "paid" && order.paymentId) {
      // In a real application, you would integrate with payment gateway to process refund
      // For demo purposes, we'll just update the status
      order.paymentStatus = "refunded"

      // Remove purchased notes from user's account
      const user = await User.findById(order.userId)
      if (user) {
        order.items.forEach((item) => {
          user.purchasedNotes = user.purchasedNotes.filter((note) => note.noteId.toString() !== item.noteId.toString())
        })
        await user.save()
      }
    }

    await order.save()

    res.status(200).json({
      success: true,
      message: "Order cancelled successfully",
      data: {
        orderId: order._id,
        status: order.status,
        paymentStatus: order.paymentStatus,
      },
    })
  } catch (error) {
    console.error("Cancel order error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to cancel order",
      error: error.message,
    })
  }
}

// Apply coupon to order
exports.applyCoupon = async (req, res) => {
  try {
    const { orderId, couponCode } = req.body

    const order = await Order.findById(orderId)

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      })
    }

    // Check if the order belongs to the logged-in user
    if (order.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access to apply coupon",
      })
    }

    // Check if order is in a valid state to apply coupon
    if (order.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "Coupon cannot be applied at this stage",
      })
    }

    // Apply discount based on coupon code
    let discount = 0
    switch (couponCode) {
      case "NEW10":
        discount = order.subtotal * 0.1 // 10% discount
        break
      case "STUDENT20":
        discount = order.subtotal * 0.2 // 20% discount
        break
      case "BUNDLE15":
        if (order.items.length >= 3) {
          discount = order.subtotal * 0.15 // 15% discount for 3+ items
        } else {
          return res.status(400).json({
            success: false,
            message: "This coupon requires at least 3 items",
          })
        }
        break
      default:
        return res.status(400).json({
          success: false,
          message: "Invalid coupon code",
        })
    }

    // Update order with discount
    order.discount = discount
    order.couponCode = couponCode

    // Recalculate GST and total
    order.gst = (order.subtotal - order.discount) * 0.18
    order.total = order.subtotal - order.discount + order.gst

    await order.save()

    res.status(200).json({
      success: true,
      message: "Coupon applied successfully",
      data: {
        orderId: order._id,
        subtotal: order.subtotal,
        discount: order.discount,
        gst: order.gst,
        total: order.total,
      },
    })
  } catch (error) {
    console.error("Apply coupon error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to apply coupon",
      error: error.message,
    })
  }
}
