const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: false, // Not required for Google OAuth users
    },
    phone: {
      type: String,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    // Google OAuth fields
    googleId: {
      type: String,
      unique: true,
      sparse: true, // Allows null/undefined for non-Google users
    },
    avatar: {
      type: String,
      default: "",
    },
    authProvider: {
      type: String,
      enum: ["local", "google"],
      default: "local",
    },
    purchasedNotes: [
      {
        noteId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Note",
        },
        purchaseDate: {
          type: Date,
          default: Date.now,
        },
        expiryDate: {
          type: Date,
        },
      },
    ],
    savedCards: [
      {
        cardNumber: String,
        cardType: String,
        expiryMonth: String,
        expiryYear: String,
        nameOnCard: String,
        isDefault: {
          type: Boolean,
          default: false,
        },
      },
    ],
    savedUpiIds: [
      {
        upiId: String,
        isDefault: {
          type: Boolean,
          default: false,
        },
      },
    ],
  },
  {
    timestamps: true,
  },
)

// Hash password before saving (only for local auth users)
UserSchema.pre("save", async function () {
  if (!this.isModified("password") || !this.password) {
    return
  }

  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

// Method to compare passwords
UserSchema.methods.matchPassword = async function (enteredPassword) {
  if (!this.password) return false
  return await bcrypt.compare(enteredPassword, this.password)
}

module.exports = mongoose.model("User", UserSchema)
