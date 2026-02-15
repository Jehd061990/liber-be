const mongoose = require("mongoose");

const readerSchema = new mongoose.Schema(
  {
    readerId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    studentId: {
      type: String,
      trim: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      trim: true,
    },
    membershipType: {
      type: String,
      required: true,
      enum: ["Student", "Teacher", "Staff"],
      trim: true,
    },
    status: {
      type: String,
      required: true,
      enum: ["Active", "Inactive", "Suspended"],
      default: "Active",
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Reader", readerSchema);
