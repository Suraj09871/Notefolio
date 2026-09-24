const Note = require("../models/Note");
const User = require("../models/User");
const Order = require("../models/Order");
const { uploadPDF, uploadImage, deleteFile } = require('../services/cloudStorage');

// Get all notes with filtering
exports.getAllNotes = async (req, res) => {
  try {
    const { subject, semester, search } = req.query;
    let query = {};

    if (subject && subject !== 'all') {
      query.subject = subject;
    }
    if (semester) {
      query.semester = semester;
    }
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const notes = await Note.find(query).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: notes });
  } catch (error) {
    console.error("Get all notes error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch notes",
      error: error.message,
    });
  }
};

// Get a single note by ID
exports.getNoteById = async (req, res) => {
  try {
    const { id } = req.params;
    const note = await Note.findById(id);

    if (!note) {
      return res.status(404).json({ success: false, message: "Note not found" });
    }

    res.status(200).json({ success: true, data: note });
  } catch (error) {
    console.error("Get note by ID error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch note",
      error: error.message,
    });
  }
};

// Add a new note (Admin only) — uploads to Cloudinary
exports.addNote = async (req, res) => {
  try {
    const { title, subject, price, description, chapters, semester, pages } = req.body;

    if (!title || !subject || !price || !description) {
      return res.status(400).json({ success: false, message: "Please fill in all required fields" });
    }

    const noteData = {
      title,
      subject,
      price,
      description,
      semester: semester || "1",
      pages: pages ? parseInt(pages, 10) : 0,
    };

    // Parse chapters if provided
    if (chapters) {
      try {
        noteData.chapters = JSON.parse(chapters);
      } catch (e) {
        noteData.chapters = [];
      }
    }

    // Upload image to Cloudinary
    if (req.files && req.files['image'] && req.files['image'][0]) {
      const imageFile = req.files['image'][0];
      const imageResult = await uploadImage(imageFile.buffer, imageFile.originalname);
      noteData.image = imageResult.url;
      noteData.imagePublicId = imageResult.publicId;
    }

    // Upload PDF to Cloudinary
    if (req.files && req.files['pdfUrl'] && req.files['pdfUrl'][0]) {
      const pdfFile = req.files['pdfUrl'][0];
      const pdfResult = await uploadPDF(pdfFile.buffer, pdfFile.originalname);
      noteData.pdfUrl = pdfResult.url;
      noteData.pdfPublicId = pdfResult.publicId;
    }

    const newNote = new Note(noteData);
    await newNote.save();
    res.status(201).json({ success: true, data: newNote, message: "Note added successfully" });
  } catch (error) {
    console.error("Add note error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add note",
      error: error.message,
    });
  }
};

// Add handwritten notes (Admin only) — uploads PDF to Cloudinary
exports.addHandwrittenNote = async (req, res) => {
  try {
    const { title, subject, price, description, chapters, semester, pages } = req.body;

    if (!title || !subject || !price || !description) {
      return res.status(400).json({ success: false, message: "Please fill in all required fields" });
    }

    // PDF is required for handwritten notes
    if (!req.files || !req.files['pdfUrl'] || !req.files['pdfUrl'][0]) {
      return res.status(400).json({ success: false, message: "Please upload a PDF file" });
    }

    const noteData = {
      title,
      subject,
      price,
      description,
      semester: semester || "1",
      pages: pages ? parseInt(pages, 10) : 0,
      isHandwritten: true,
    };

    // Upload PDF to Cloudinary
    const pdfFile = req.files['pdfUrl'][0];
    const pdfResult = await uploadPDF(pdfFile.buffer, pdfFile.originalname);
    noteData.pdfUrl = pdfResult.url;
    noteData.pdfPublicId = pdfResult.publicId;

    // Upload cover image if provided
    if (req.files && req.files['image'] && req.files['image'][0]) {
      const imageFile = req.files['image'][0];
      const imageResult = await uploadImage(imageFile.buffer, imageFile.originalname);
      noteData.image = imageResult.url;
      noteData.imagePublicId = imageResult.publicId;
    }

    // Parse chapters if provided
    if (chapters) {
      try {
        noteData.chapters = JSON.parse(chapters);
      } catch (e) {
        noteData.chapters = [];
      }
    }

    const newNote = new Note(noteData);
    await newNote.save();
    res.status(201).json({ success: true, data: newNote, message: "Handwritten notes uploaded successfully" });
  } catch (error) {
    console.error("Add handwritten note error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to upload handwritten notes",
      error: error.message,
    });
  }
};

// Update an existing note (Admin only)
exports.updateNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, subject, price, description, chapters, semester, pages } = req.body;
    let updateData = { title, subject, price, description, semester };
    
    if (pages !== undefined && pages !== null) {
      updateData.pages = parseInt(pages, 10);
    }

    if (chapters) {
      try {
        updateData.chapters = JSON.parse(chapters);
      } catch (e) { /* keep existing */ }
    }

    // Upload new image if provided
    if (req.files && req.files['image'] && req.files['image'][0]) {
      const imageFile = req.files['image'][0];
      const imageResult = await uploadImage(imageFile.buffer, imageFile.originalname);
      updateData.image = imageResult.url;
      updateData.imagePublicId = imageResult.publicId;

      // Delete old image from Cloudinary
      const oldNote = await Note.findById(id);
      if (oldNote && oldNote.imagePublicId) {
        await deleteFile(oldNote.imagePublicId, 'image');
      }
    }

    // Upload new PDF if provided
    if (req.files && req.files['pdfUrl'] && req.files['pdfUrl'][0]) {
      const pdfFile = req.files['pdfUrl'][0];
      const pdfResult = await uploadPDF(pdfFile.buffer, pdfFile.originalname);
      updateData.pdfUrl = pdfResult.url;
      updateData.pdfPublicId = pdfResult.publicId;

      // Delete old PDF from Cloudinary
      const oldNote = await Note.findById(id);
      if (oldNote && oldNote.pdfPublicId) {
        await deleteFile(oldNote.pdfPublicId, 'raw');
      }
    }

    const updatedNote = await Note.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedNote) {
      return res.status(404).json({ success: false, message: "Note not found" });
    }

    res.status(200).json({ success: true, data: updatedNote, message: "Note updated successfully" });
  } catch (error) {
    console.error("Update note error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update note",
      error: error.message,
    });
  }
};

// Soft delete a note (Admin only)
exports.deleteNote = async (req, res) => {
  try {
    const { id } = req.params;
    const note = await Note.findById(id);

    if (!note) {
      return res.status(404).json({ success: false, message: "Note not found" });
    }

    // Mark as deleted (soft delete)
    note.isDeleted = true;
    await note.save();

    // Optionally delete files from Cloudinary
    if (note.pdfPublicId) {
      await deleteFile(note.pdfPublicId, 'image');
    }
    if (note.imagePublicId) {
      await deleteFile(note.imagePublicId, 'image');
    }

    res.status(200).json({ success: true, message: "Note deleted successfully" });
  } catch (error) {
    console.error("Delete note error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete note",
      error: error.message,
    });
  }
};

// Get dashboard statistics (Admin only)
exports.getAdminStats = async (req, res) => {
  try {
    const totalNotes = await Note.countDocuments({ isDeleted: false });
    const totalUsers = await User.countDocuments();
    const totalOrders = await Order.countDocuments();

    const orders = await Order.find({ paymentStatus: "paid" });
    const totalRevenue = orders.reduce((acc, order) => acc + (order.total || 0), 0);

    res.status(200).json({
      success: true,
      data: { totalNotes, totalUsers, totalOrders, totalRevenue },
    });
  } catch (error) {
    console.error("Get admin stats error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch admin statistics",
      error: error.message,
    });
  }
};
