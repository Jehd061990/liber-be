const express = require("express");
const {
  createBorrow,
  listBorrows,
  getBorrowById,
  updateBorrow,
  deleteBorrow,
} = require("../controllers/borrowController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protect, listBorrows);
router.get("/:id", protect, getBorrowById);
router.post("/", protect, createBorrow);
router.put("/:id", protect, updateBorrow);
router.delete("/:id", protect, deleteBorrow);

module.exports = router;
