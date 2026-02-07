const Book = require("../models/Book");
const { validateBookCreate } = require("../validators/bookValidator");

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

module.exports = {
  addBook,
  listBooks,
};
