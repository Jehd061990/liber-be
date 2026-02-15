const Borrow = require("../models/Borrow");
const Reader = require("../models/Reader");
const Book = require("../models/Book");
const {
  validateBorrowCreate,
  validateBorrowUpdate,
  calculateDueDate,
  BORROWING_RULES,
} = require("../validators/borrowValidator");

const createBorrow = async (req, res, next) => {
  try {
    const payload = validateBorrowCreate(req.body);

    // Check if reader exists
    const reader = await Reader.findById(payload.reader);
    if (!reader) {
      return res.status(404).json({ message: "Reader not found" });
    }

    // Check if reader is active
    if (reader.status !== "Active") {
      return res.status(400).json({ message: "Reader is not active" });
    }

    // Check if book exists
    const book = await Book.findById(payload.book);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    // Check if book is available
    if (!book.availableCopies || book.availableCopies <= 0) {
      return res.status(400).json({ message: "Book is not available" });
    }

    // Check if reader has reached max books limit
    const activeBorrows = await Borrow.countDocuments({
      reader: payload.reader,
      status: "Borrowed",
    });

    const maxBooks = BORROWING_RULES[reader.membershipType]?.maxBooks || 3;
    if (activeBorrows >= maxBooks) {
      return res.status(400).json({
        message: `Reader has reached maximum borrowing limit of ${maxBooks} books`,
      });
    }

    // Check if reader already borrowed this book and hasn't returned it
    const existingBorrow = await Borrow.findOne({
      reader: payload.reader,
      book: payload.book,
      status: "Borrowed",
    });

    if (existingBorrow) {
      return res.status(400).json({
        message: "Reader has already borrowed this book",
      });
    }

    // Calculate due date if not provided
    let dueDate = payload.dueDate;
    if (!dueDate) {
      dueDate = calculateDueDate(payload.borrowDate, reader.membershipType);
    }

    // Create borrow record
    const borrow = await Borrow.create({
      ...payload,
      dueDate,
      createdBy: req.user ? req.user.id : undefined,
    });

    // Update book available copies
    book.availableCopies -= 1;
    await book.save();

    // Populate reader and book details
    const populatedBorrow = await Borrow.findById(borrow._id)
      .populate("reader", "readerId fullName email membershipType")
      .populate("book", "title bookAuthor isbn");

    res.status(201).json({
      borrow: populatedBorrow,
    });
  } catch (error) {
    next(error);
  }
};

const listBorrows = async (req, res, next) => {
  try {
    const {
      search,
      reader,
      book,
      status,
      borrowDateFrom,
      borrowDateTo,
      dueDateFrom,
      dueDateTo,
    } = req.query;

    const filter = {};

    if (reader) {
      filter.reader = reader;
    }

    if (book) {
      filter.book = book;
    }

    if (status) {
      filter.status = status;
    }

    if (borrowDateFrom || borrowDateTo) {
      filter.borrowDate = {};
      if (borrowDateFrom) {
        const date = new Date(borrowDateFrom);
        if (!isNaN(date.getTime())) {
          filter.borrowDate.$gte = date;
        }
      }
      if (borrowDateTo) {
        const date = new Date(borrowDateTo);
        if (!isNaN(date.getTime())) {
          filter.borrowDate.$lte = date;
        }
      }
    }

    if (dueDateFrom || dueDateTo) {
      filter.dueDate = {};
      if (dueDateFrom) {
        const date = new Date(dueDateFrom);
        if (!isNaN(date.getTime())) {
          filter.dueDate.$gte = date;
        }
      }
      if (dueDateTo) {
        const date = new Date(dueDateTo);
        if (!isNaN(date.getTime())) {
          filter.dueDate.$lte = date;
        }
      }
    }

    const borrows = await Borrow.find(filter)
      .populate("reader", "readerId fullName email membershipType status")
      .populate("book", "title bookAuthor isbn availableCopies")
      .sort({ createdAt: -1 });

    // If search is provided, filter the populated results
    let filteredBorrows = borrows;
    if (search) {
      const searchValue = String(search).trim().toLowerCase();
      filteredBorrows = borrows.filter((borrow) => {
        const readerMatch =
          borrow.reader?.readerId?.toLowerCase().includes(searchValue) ||
          borrow.reader?.fullName?.toLowerCase().includes(searchValue) ||
          borrow.reader?.email?.toLowerCase().includes(searchValue);

        const bookMatch =
          borrow.book?.title?.toLowerCase().includes(searchValue) ||
          borrow.book?.bookAuthor?.toLowerCase().includes(searchValue) ||
          borrow.book?.isbn?.toLowerCase().includes(searchValue);

        return readerMatch || bookMatch;
      });
    }

    res.json({
      borrows: filteredBorrows,
    });
  } catch (error) {
    next(error);
  }
};

const getBorrowById = async (req, res, next) => {
  try {
    const borrow = await Borrow.findById(req.params.id)
      .populate(
        "reader",
        "readerId fullName email phoneNumber membershipType status address",
      )
      .populate(
        "book",
        "title bookAuthor isbn publisher category availableCopies totalCopies",
      );

    if (!borrow) {
      return res.status(404).json({ message: "Borrow record not found" });
    }

    res.json({
      borrow,
    });
  } catch (error) {
    next(error);
  }
};

const updateBorrow = async (req, res, next) => {
  try {
    const updates = validateBorrowUpdate(req.body);

    const existingBorrow = await Borrow.findById(req.params.id);
    if (!existingBorrow) {
      return res.status(404).json({ message: "Borrow record not found" });
    }

    // If reader is being updated, validate the new reader
    if (updates.reader) {
      const reader = await Reader.findById(updates.reader);
      if (!reader) {
        return res.status(404).json({ message: "Reader not found" });
      }
      if (reader.status !== "Active") {
        return res.status(400).json({ message: "Reader is not active" });
      }
    }

    // If book is being updated, validate the new book
    if (updates.book) {
      const book = await Book.findById(updates.book);
      if (!book) {
        return res.status(404).json({ message: "Book not found" });
      }
    }

    // If status is being changed to "Returned", update book availability
    if (updates.status === "Returned" && existingBorrow.status !== "Returned") {
      const book = await Book.findById(existingBorrow.book);
      if (book) {
        book.availableCopies += 1;
        await book.save();
      }

      // Set return date to now if not provided
      if (!updates.returnDate) {
        updates.returnDate = new Date();
      }
    }

    // If status is being changed from "Returned" to something else, decrease book availability
    if (
      existingBorrow.status === "Returned" &&
      updates.status &&
      updates.status !== "Returned"
    ) {
      const book = await Book.findById(existingBorrow.book);
      if (book && book.availableCopies > 0) {
        book.availableCopies -= 1;
        await book.save();
      }

      // Clear return date
      updates.returnDate = null;
    }

    const borrow = await Borrow.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    })
      .populate("reader", "readerId fullName email membershipType")
      .populate("book", "title bookAuthor isbn");

    res.json({
      borrow,
    });
  } catch (error) {
    next(error);
  }
};

const deleteBorrow = async (req, res, next) => {
  try {
    const borrow = await Borrow.findById(req.params.id);

    if (!borrow) {
      return res.status(404).json({ message: "Borrow record not found" });
    }

    // If borrow status is "Borrowed", return the book to inventory
    if (borrow.status === "Borrowed") {
      const book = await Book.findById(borrow.book);
      if (book) {
        book.availableCopies += 1;
        await book.save();
      }
    }

    await Borrow.findByIdAndDelete(req.params.id);

    res.json({ message: "Borrow record deleted" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createBorrow,
  listBorrows,
  getBorrowById,
  updateBorrow,
  deleteBorrow,
};
