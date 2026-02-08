const Book = require("../models/Book");
const {
  validateBookCreate,
  validateBookUpdate,
} = require("../validators/bookValidator");

const addBook = async (req, res, next) => {
  try {
    const payload = validateBookCreate(req.body);

    const book = await Book.create({
      ...payload,
      createdBy: req.user ? req.user.id : undefined,
    });

    res.status(201).json({
      book,
    });
  } catch (error) {
    next(error);
  }
};

const listBooks = async (req, res, next) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 });

    res.json({
      books,
    });
  } catch (error) {
    next(error);
  }
};

const updateBook = async (req, res, next) => {
  try {
    const updates = validateBookUpdate(req.body);

    const book = await Book.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.json({
      book,
    });
  } catch (error) {
    next(error);
  }
};

const deleteBook = async (req, res, next) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.json({ message: "Book deleted" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addBook,
  listBooks,
  updateBook,
  deleteBook,
};
