const Payment = require("../models/Payment")
const Order = require("../models/Order")
const User = require("../models/User")
const crypto = require("crypto")

// Process card payment
exports.processCardPayment = async (req, res) => {
  try {
    const { orderId, cardNumber, cardExpiry, cvv, nameOnCard } = req.body

    // Find the order
    const order = await Order.findById(orderId)
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" })
    }

    // In a real application, you would integrate with a payment gateway here
    // For demo purposes, we'll simulate a successful payment

    // Create payment record
    const payment = new Payment({
      orderId: order._id,
      userId: order.userId,
      amount: order.total,
      paymentMethod: "card",
      paymentDetails: {
        cardNumber: `XXXX-XXXX-XXXX-${cardNumber.slice(-4)}`,
        cardExpiry,
        nameOnCard,
      },
      status: "completed",
      transactionId: `CARD-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    })

    await payment.save()

    // Update order status
    order.paymentStatus = "paid"
    order.status = "processing"
    order.paymentId = payment._id
    order.paymentMethod = "card"
    await order.save()

    // Add purchased notes to user's account
    const user = await User.findById(order.userId)
    if (user) {
      order.items.forEach((item) => {
        // Set expiry date to 1 year from now
        const expiryDate = new Date()
        expiryDate.setMonth(expiryDate.getMonth() + 6)

        user.purchasedNotes.push({
          noteId: item.noteId,
          purchaseDate: new Date(),
          expiryDate,
        })
      })
      await user.save()
    }

    // Save card for future use if requested
    if (req.body.saveCard && user) {
      const newCard = {
        cardNumber: `XXXX-XXXX-XXXX-${cardNumber.slice(-4)}`,
        cardType: getCardType(cardNumber),
        expiryMonth: cardExpiry.split("/")[0],
        expiryYear: cardExpiry.split("/")[1],
        nameOnCard,
        isDefault: user.savedCards.length === 0,
      }

      user.savedCards.push(newCard)
      await user.save()
    }

    res.status(200).json({
      success: true,
      data: {
        paymentId: payment._id,
        transactionId: payment.transactionId,
        amount: payment.amount,
        status: payment.status,
      },
    })
  } catch (error) {
    console.error("Card payment error:", error)
    res.status(500).json({
      success: false,
      message: "Payment processing failed",
      error: error.message,
    })
  }
}

// Process UPI payment
exports.processUpiPayment = async (req, res) => {
  try {
    const { orderId, upiId } = req.body

    // Find the order
    const order = await Order.findById(orderId)
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" })
    }

    // In a real application, you would integrate with a UPI payment gateway here
    // For demo purposes, we'll simulate a successful payment

    // Create payment record
    const payment = new Payment({
      orderId: order._id,
      userId: order.userId,
      amount: order.total,
      paymentMethod: "upi",
      paymentDetails: {
        upiId,
      },
      status: "completed",
      transactionId: `UPI-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    })

    await payment.save()

    // Update order status
    order.paymentStatus = "paid"
    order.status = "processing"
    order.paymentId = payment._id
    order.paymentMethod = "upi"
    await order.save()

    // Add purchased notes to user's account
    const user = await User.findById(order.userId)
    if (user) {
      order.items.forEach((item) => {
        // Set expiry date to 1 year from now
        const expiryDate = new Date()
        expiryDate.setMonth(expiryDate.getMonth() + 6)

        user.purchasedNotes.push({
          noteId: item.noteId,
          purchaseDate: new Date(),
          expiryDate,
        })
      })

      // Save UPI ID for future use if requested
      if (req.body.saveUpi) {
        const newUpi = {
          upiId,
          isDefault: user.savedUpiIds.length === 0,
        }

        user.savedUpiIds.push(newUpi)
      }

      await user.save()
    }

    res.status(200).json({
      success: true,
      data: {
        paymentId: payment._id,
        transactionId: payment.transactionId,
        amount: payment.amount,
        status: payment.status,
      },
    })
  } catch (error) {
    console.error("UPI payment error:", error)
    res.status(500).json({
      success: false,
      message: "Payment processing failed",
      error: error.message,
    })
  }
}

// Process Net Banking payment
exports.processNetBankingPayment = async (req, res) => {
  try {
    const { orderId, bankCode, bankName } = req.body

    // Find the order
    const order = await Order.findById(orderId)
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" })
    }

    // In a real application, you would redirect to the bank's payment page
    // For demo purposes, we'll simulate a successful payment

    // Create payment record
    const payment = new Payment({
      orderId: order._id,
      userId: order.userId,
      amount: order.total,
      paymentMethod: "netbanking",
      paymentDetails: {
        bankCode,
        bankName,
      },
      status: "completed",
      transactionId: `NB-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    })

    await payment.save()

    // Update order status
    order.paymentStatus = "paid"
    order.status = "processing"
    order.paymentId = payment._id
    order.paymentMethod = "netbanking"
    await order.save()

    // Add purchased notes to user's account
    const user = await User.findById(order.userId)
    if (user) {
      order.items.forEach((item) => {
        // Set expiry date to 1 year from now
        const expiryDate = new Date()
        expiryDate.setMonth(expiryDate.getMonth() + 6)

        user.purchasedNotes.push({
          noteId: item.noteId,
          purchaseDate: new Date(),
          expiryDate,
        })
      })
      await user.save()
    }

    res.status(200).json({
      success: true,
      data: {
        paymentId: payment._id,
        transactionId: payment.transactionId,
        amount: payment.amount,
        status: payment.status,
      },
    })
  } catch (error) {
    console.error("Net Banking payment error:", error)
    res.status(500).json({
      success: false,
      message: "Payment processing failed",
      error: error.message,
    })
  }
}

// Create Razorpay order
exports.createRazorpayOrder = async (req, res) => {
  try {
    const { orderId } = req.body

    // Find the order
    const order = await Order.findById(orderId)
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" })
    }

    // Create Razorpay order
    const razorpayOrder = await req.app.locals.razorpay.orders.create({
      amount: order.total * 100, // Razorpay expects amount in paise
      currency: "INR",
      receipt: orderId,
      payment_capture: 1,
    })

    res.status(200).json({
      success: true,
      data: {
        orderId: razorpayOrder.id,
        amount: razorpayOrder.amount / 100,
        currency: razorpayOrder.currency,
        key: process.env.RAZORPAY_KEY_ID,
      },
    })
  } catch (error) {
    console.error("Razorpay order creation error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to create Razorpay order",
      error: error.message,
    })
  }
}

// Verify Razorpay payment
exports.verifyRazorpayPayment = async (req, res) => {
  try {
    const { orderId, razorpayPaymentId, razorpayOrderId, razorpaySignature } = req.body

    // Find the order
    const order = await Order.findById(orderId)
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" })
    }

    // Verify signature
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest("hex")

    if (generatedSignature !== razorpaySignature) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment signature",
      })
    }

    // Create payment record
    const payment = new Payment({
      orderId: order._id,
      userId: order.userId,
      amount: order.total,
      paymentMethod: "razorpay",
      paymentDetails: {
        razorpayOrderId,
        razorpayPaymentId,
        razorpaySignature,
      },
      status: "completed",
      transactionId: razorpayPaymentId,
      razorpayPaymentId,
      razorpayOrderId,
      razorpaySignature,
    })

    await payment.save()

    // Update order status
    order.paymentStatus = "paid"
    order.status = "processing"
    order.paymentId = payment._id
    order.paymentMethod = "razorpay"
    await order.save()

    // Add purchased notes to user's account
    const user = await User.findById(order.userId)
    if (user) {
      order.items.forEach((item) => {
        // Set expiry date to 1 year from now
        const expiryDate = new Date()
        expiryDate.setMonth(expiryDate.getMonth() + 6)

        user.purchasedNotes.push({
          noteId: item.noteId,
          purchaseDate: new Date(),
          expiryDate,
        })
      })
      await user.save()
    }

    res.status(200).json({
      success: true,
      data: {
        paymentId: payment._id,
        transactionId: payment.transactionId,
        amount: payment.amount,
        status: payment.status,
      },
    })
  } catch (error) {
    console.error("Razorpay verification error:", error)
    res.status(500).json({
      success: false,
      message: "Payment verification failed",
      error: error.message,
    })
  }
}

// Get saved payment methods
exports.getSavedPaymentMethods = async (req, res) => {
  try {
    const userId = req.user.id

    const user = await User.findById(userId).select("savedCards savedUpiIds")

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }

    res.status(200).json({
      success: true,
      data: {
        savedCards: user.savedCards || [],
        savedUpiIds: user.savedUpiIds || [],
      },
    })
  } catch (error) {
    console.error("Get saved payment methods error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to fetch saved payment methods",
      error: error.message,
    })
  }
}

// Delete saved payment method
exports.deleteSavedPaymentMethod = async (req, res) => {
  try {
    const userId = req.user.id
    const { type, id } = req.params

    const user = await User.findById(userId)

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }

    if (type === "card") {
      user.savedCards = user.savedCards.filter((card) => card._id.toString() !== id)
    } else if (type === "upi") {
      user.savedUpiIds = user.savedUpiIds.filter((upi) => upi._id.toString() !== id)
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid payment method type",
      })
    }

    await user.save()

    res.status(200).json({
      success: true,
      message: "Payment method deleted successfully",
    })
  } catch (error) {
    console.error("Delete payment method error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to delete payment method",
      error: error.message,
    })
  }
}

// Set default payment method
exports.setDefaultPaymentMethod = async (req, res) => {
  try {
    const userId = req.user.id
    const { type, id } = req.params

    const user = await User.findById(userId)

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }

    if (type === "card") {
      user.savedCards.forEach((card) => {
        card.isDefault = card._id.toString() === id
      })
    } else if (type === "upi") {
      user.savedUpiIds.forEach((upi) => {
        upi.isDefault = upi._id.toString() === id
      })
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid payment method type",
      })
    }

    await user.save()

    res.status(200).json({
      success: true,
      message: "Default payment method updated successfully",
    })
  } catch (error) {
    console.error("Set default payment method error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to set default payment method",
      error: error.message,
    })
  }
}

// Get payment history
exports.getPaymentHistory = async (req, res) => {
  try {
    const userId = req.user.id

    const payments = await Payment.find({ userId }).sort({ createdAt: -1 }).populate({
      path: "orderId",
      select: "items status",
    })

    res.status(200).json({
      success: true,
      data: payments,
    })
  } catch (error) {
    console.error("Get payment history error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to fetch payment history",
      error: error.message,
    })
  }
}

// Get payment details
exports.getPaymentDetails = async (req, res) => {
  try {
    const { paymentId } = req.params

    const payment = await Payment.findById(paymentId).populate({
      path: "orderId",
      select: "items subtotal discount gst total status",
    })

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found",
      })
    }

    // Check if the payment belongs to the logged-in user
    if (payment.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access to payment details",
      })
    }

    res.status(200).json({
      success: true,
      data: payment,
    })
  } catch (error) {
    console.error("Get payment details error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to fetch payment details",
      error: error.message,
    })
  }
}

// Helper function to determine card type based on card number
function getCardType(cardNumber) {
  // Remove spaces and dashes
  cardNumber = cardNumber.replace(/[\s-]/g, "")

  // Visa
  if (/^4/.test(cardNumber)) {
    return "Visa"
  }

  // Mastercard
  if (/^5[1-5]/.test(cardNumber)) {
    return "Mastercard"
  }

  // American Express
  if (/^3[47]/.test(cardNumber)) {
    return "American Express"
  }

  // Discover
  if (/^6(?:011|5)/.test(cardNumber)) {
    return "Discover"
  }

  // RuPay
  if (/^6[0-9]{15}$/.test(cardNumber)) {
    return "RuPay"
  }

  return "Unknown"
}
