const express = require("express")
const router = express.Router()
const { protect } = require("../middleware/authMiddleware")
const {
  registerUser,
  loginUser,
  googleRedirect,
  googleCallback,
  getUserProfile,
  updateUserProfile,
} = require("../controllers/authController")

// Public routes
router.post("/register", registerUser)
router.post("/login", loginUser)

// Google OAuth 2.0 redirect flow
router.get("/google", googleRedirect)           // Step 1: Redirect to Google
router.get("/google/callback", googleCallback)   // Step 2: Google redirects back

// Protected routes
router.get("/profile", protect, getUserProfile)
router.put("/profile", protect, updateUserProfile)

// Admin routes (would ideally use an admin middleware, but protect is fine for now if checking role)
const { getAllUsers, deleteUser, removePurchasedNote } = require("../controllers/authController")
router.delete("/purchased/:noteId", protect, removePurchasedNote)
router.get("/", protect, getAllUsers)
router.delete("/:id", protect, deleteUser)

module.exports = router
