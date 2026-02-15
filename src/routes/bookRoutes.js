const express = require("express");
const {
  addBook,
  listBooks,
  getBookById,
  updateBook,
  deleteBook,
} = require("../controllers/bookController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protect, listBooks);
router.get("/:id", protect, getBookById);
router.post("/", protect, addBook);
router.put("/:id", protect, updateBook);
router.delete("/:id", protect, deleteBook);

module.exports = router;
