const express = require("express");
const router = express.Router();
const { protect, admin } = require("../middleware/authMiddleware");
const { upload } = require('../middleware/uploadMiddleware');
const {
  getAllNotes,
  getNoteById,
  addNote,
  addHandwrittenNote,
  updateNote,
  deleteNote,
  getAdminStats,
} = require("../controllers/noteController");

// Define upload middleware for multiple files
const uploadMiddleware = upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'pdfUrl', maxCount: 1 }
]);

// Public routes
router.get("/", getAllNotes);
router.get("/admin/stats", protect, admin, getAdminStats);
router.get("/:id", getNoteById);

// Admin routes (protected)
router.post("/", protect, admin, uploadMiddleware, addNote);
router.post("/handwritten", protect, admin, uploadMiddleware, addHandwrittenNote);
router.put("/:id", protect, admin, uploadMiddleware, updateNote);
router.delete("/:id", protect, admin, deleteNote);

module.exports = router;
