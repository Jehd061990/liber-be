const express = require("express");
const { addBook, listBooks } = require("../controllers/bookController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", listBooks);
router.post("/", protect, addBook);

module.exports = router;
