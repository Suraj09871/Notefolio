const mongoose = require("mongoose")

const NoteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    description: {
      type: String,
      required: true,
    },
    chapters: [
      {
        title: {
          type: String,
          required: true,
        },
        pages: {
          type: String,
          required: true,
        },
      },
    ],
    semester: {
      type: String,
      default: "1",
    },
    image: {
      type: String,
      default: "",
    },
    imagePublicId: {
      type: String,
      default: "",
    },
    pdfUrl: {
      type: String,
      default: "",
    },
    pdfPublicId: {
      type: String,
      default: "",
    },
    pages: {
      type: Number,
      default: 0,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    isHandwritten: {
      type: Boolean,
      default: false,
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    totalRatings: {
      type: Number,
      default: 0,
    },
    totalDownloads: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
)

// Only return non-deleted notes by default
NoteSchema.pre("find", function () {
  if (!this.getQuery().hasOwnProperty("isDeleted")) {
    this.where({ isDeleted: false })
  }
})

NoteSchema.pre("findOne", function () {
  if (!this.getQuery().hasOwnProperty("isDeleted")) {
    this.where({ isDeleted: false })
  }
})

module.exports = mongoose.model("Note", NoteSchema)
