const express = require("express");
const {
  addBook,
  listBooks,
  updateBook,
  deleteBook,
} = require("../controllers/bookController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protect, listBooks);
router.post("/", protect, addBook);
router.put("/:id", protect, updateBook);
router.delete("/:id", protect, deleteBook);

module.exports = router;
