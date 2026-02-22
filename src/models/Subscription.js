const mongoose = require("mongoose");

const SubscriptionSchema = new mongoose.Schema({
  reader: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Reader",
    required: true,
  },
  plan: {
    type: String,
    enum: ["basic", "premium", "enterprise"],
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ["active", "expired", "cancelled"],
    default: "active",
  },
});

module.exports = mongoose.model("Subscription", SubscriptionSchema);
