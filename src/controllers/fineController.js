const Fine = require("../models/Fine");
const Reader = require("../models/Reader");
const Book = require("../models/Book");

// Create a new fine
exports.createFine = async (req, res) => {
  try {
    const { reader, type, book, reason, amount } = req.body;
    const fine = new Fine({ reader, type, book, reason, amount });
    await fine.save();
    res.status(201).json(fine);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all fines (with optional search)
exports.getFines = async (req, res) => {
  try {
    const { search, status } = req.query;
    let query = {};
    if (status && status !== "all") query.status = status;
    if (search) {
      query.$or = [{ reason: { $regex: search, $options: "i" } }];
    }
    const fines = await Fine.find(query)
      .populate("reader", "name readerId")
      .populate("book", "title");
    res.json(fines);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a single fine
exports.getFine = async (req, res) => {
  try {
    const fine = await Fine.findById(req.params.id)
      .populate("reader", "name readerId")
      .populate("book", "title");
    if (!fine) return res.status(404).json({ error: "Fine not found" });
    res.json(fine);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update a fine
exports.updateFine = async (req, res) => {
  try {
    const fine = await Fine.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!fine) return res.status(404).json({ error: "Fine not found" });
    res.json(fine);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete a fine
exports.deleteFine = async (req, res) => {
  try {
    const fine = await Fine.findByIdAndDelete(req.params.id);
    if (!fine) return res.status(404).json({ error: "Fine not found" });
    res.json({ message: "Fine deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Mark fine as paid
exports.payFine = async (req, res) => {
  try {
    const fine = await Fine.findById(req.params.id);
    if (!fine) return res.status(404).json({ error: "Fine not found" });
    fine.status = "paid";
    fine.paidAt = new Date();
    await fine.save();
    res.json(fine);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
