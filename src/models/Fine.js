const mongoose = require("mongoose");

const FineSchema = new mongoose.Schema({
  reader: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Reader",
    required: true,
  },
  type: {
    type: String,
    enum: ["manual", "overdue"],
    required: true,
  },
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Book",
    required: false,
  },
  reason: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["unpaid", "paid"],
    default: "unpaid",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  paidAt: {
    type: Date,
  },
  fineId: {
    type: Number,
    unique: true,
    index: true,
  },
});

FineSchema.virtual("fineIdString").get(function () {
  return this.fineId ? `FID${this.fineId}` : undefined;
});

FineSchema.set("toJSON", { virtuals: true });
FineSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("Fine", FineSchema);
