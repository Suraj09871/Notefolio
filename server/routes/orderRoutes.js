const express = require("express")
const router = express.Router()
const { protect } = require("../middleware/authMiddleware")
const {
  createOrder,
  getOrderDetails,
  getOrderHistory,
  cancelOrder,
  applyCoupon,
} = require("../controllers/orderController")

// Order routes
router.post("/", protect, createOrder)
router.get("/:orderId", protect, getOrderDetails)
router.get("/", protect, getOrderHistory)
router.put("/:orderId/cancel", protect, cancelOrder)
router.post("/apply-coupon", protect, applyCoupon)

module.exports = router
