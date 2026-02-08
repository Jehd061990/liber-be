const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    bookAuthor: {
      type: String,
      required: true,
      trim: true,
    },
    isbn: {
      type: String,
      trim: true,
    },
    publisher: {
      type: String,
      trim: true,
    },
    category: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    genre: {
      type: String,
      trim: true,
    },
    coverImage: {
      type: String,
      trim: true,
    },
    barcode: {
      type: String,
      trim: true,
    },
    qrCode: {
      type: String,
      trim: true,
    },
    shelfLocation: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      trim: true,
      default: "Available",
    },
    availableCopies: {
      type: Number,
      default: 0,
    },
    totalCopies: {
      type: Number,
      default: 0,
    },
    publishedYear: {
      type: Number,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Book", bookSchema);
