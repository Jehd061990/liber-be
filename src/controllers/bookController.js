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
    const {
      search,
      title,
      author,
      bookAuthor,
      isbn,
      publisher,
      category,
      genre,
      status,
      publishedYear,
      publishedYearFrom,
      publishedYearTo,
      availableCopiesMin,
      availableCopiesMax,
      totalCopiesMin,
      totalCopiesMax,
      shelfLocation,
      barcode,
      qrCode,
    } = req.query;

    const filter = {};

    const addRegexFilter = (field, value) => {
      if (value) {
        filter[field] = { $regex: String(value).trim(), $options: "i" };
      }
    };

    if (search) {
      const searchValue = String(search).trim();
      if (searchValue) {
        filter.$or = [
          { title: { $regex: searchValue, $options: "i" } },
          { bookAuthor: { $regex: searchValue, $options: "i" } },
          { isbn: { $regex: searchValue, $options: "i" } },
          { publisher: { $regex: searchValue, $options: "i" } },
          { category: { $regex: searchValue, $options: "i" } },
          { description: { $regex: searchValue, $options: "i" } },
          { genre: { $regex: searchValue, $options: "i" } },
          { barcode: { $regex: searchValue, $options: "i" } },
          { qrCode: { $regex: searchValue, $options: "i" } },
          { shelfLocation: { $regex: searchValue, $options: "i" } },
        ];
      }
    }

    addRegexFilter("title", title);
    addRegexFilter("bookAuthor", bookAuthor || author);
    addRegexFilter("isbn", isbn);
    addRegexFilter("publisher", publisher);
    addRegexFilter("category", category);
    addRegexFilter("genre", genre);
    addRegexFilter("status", status);
    addRegexFilter("shelfLocation", shelfLocation);
    addRegexFilter("barcode", barcode);
    addRegexFilter("qrCode", qrCode);

    if (publishedYear !== undefined) {
      const parsed = Number(publishedYear);
      if (Number.isNaN(parsed)) {
        const error = new Error("Published year must be a number");
        error.status = 400;
        throw error;
      }
      filter.publishedYear = parsed;
    }

    if (publishedYearFrom !== undefined || publishedYearTo !== undefined) {
      const range = {};

      if (publishedYearFrom !== undefined) {
        const parsedFrom = Number(publishedYearFrom);
        if (Number.isNaN(parsedFrom)) {
          const error = new Error("Published year from must be a number");
          error.status = 400;
          throw error;
        }
        range.$gte = parsedFrom;
      }

      if (publishedYearTo !== undefined) {
        const parsedTo = Number(publishedYearTo);
        if (Number.isNaN(parsedTo)) {
          const error = new Error("Published year to must be a number");
          error.status = 400;
          throw error;
        }
        range.$lte = parsedTo;
      }

      if (Object.keys(range).length > 0) {
        filter.publishedYear = range;
      }
    }

    const addNumberRange = (field, minValue, maxValue, label) => {
      if (minValue === undefined && maxValue === undefined) {
        return;
      }

      const range = {};

      if (minValue !== undefined) {
        const parsedMin = Number(minValue);
        if (Number.isNaN(parsedMin)) {
          const error = new Error(`${label} min must be a number`);
          error.status = 400;
          throw error;
        }
        range.$gte = parsedMin;
      }

      if (maxValue !== undefined) {
        const parsedMax = Number(maxValue);
        if (Number.isNaN(parsedMax)) {
          const error = new Error(`${label} max must be a number`);
          error.status = 400;
          throw error;
        }
        range.$lte = parsedMax;
      }

      if (Object.keys(range).length > 0) {
        filter[field] = range;
      }
    };

    addNumberRange(
      "availableCopies",
      availableCopiesMin,
      availableCopiesMax,
      "Available copies",
    );
    addNumberRange(
      "totalCopies",
      totalCopiesMin,
      totalCopiesMax,
      "Total copies",
    );

    const books = await Book.find(filter).sort({ createdAt: -1 });

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

const getBookById = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);

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
  getBookById,
  updateBook,
  deleteBook,
};
