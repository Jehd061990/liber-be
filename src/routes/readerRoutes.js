const express = require("express");
const {
  createReader,
  listReaders,
  getReaderById,
  updateReader,
  deleteReader,
} = require("../controllers/readerController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protect, listReaders);
router.get("/:id", protect, getReaderById);
router.post("/", protect, createReader);
router.put("/:id", protect, updateReader);
router.delete("/:id", protect, deleteReader);

module.exports = router;
