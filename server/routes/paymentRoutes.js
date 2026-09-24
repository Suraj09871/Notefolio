const express = require("express")
const router = express.Router()
const { protect } = require("../middleware/authMiddleware")
const {
  processCardPayment,
  processUpiPayment,
  processNetBankingPayment,
  createRazorpayOrder,
  verifyRazorpayPayment,
  getSavedPaymentMethods,
  deleteSavedPaymentMethod,
  setDefaultPaymentMethod,
  getPaymentHistory,
  getPaymentDetails,
} = require("../controllers/paymentController")

// Process payments
router.post("/card", protect, processCardPayment)
router.post("/upi", protect, processUpiPayment)
router.post("/netbanking", protect, processNetBankingPayment)

// Razorpay integration
router.post("/razorpay/create", protect, createRazorpayOrder)
router.post("/razorpay/verify", protect, verifyRazorpayPayment)

// Saved payment methods
router.get("/saved", protect, getSavedPaymentMethods)
router.delete("/saved/:type/:id", protect, deleteSavedPaymentMethod)
router.put("/saved/:type/:id/default", protect, setDefaultPaymentMethod)

// Payment history
router.get("/history", protect, getPaymentHistory)
router.get("/:paymentId", protect, getPaymentDetails)

module.exports = router
