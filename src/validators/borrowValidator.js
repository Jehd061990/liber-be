const mongoose = require("mongoose");

// Borrowing rules based on membership type
const BORROWING_RULES = {
  Student: {
    maxBooks: 3,
    durationDays: 14,
  },
  Teacher: {
    maxBooks: 5,
    durationDays: 30,
  },
  Staff: {
    maxBooks: 5,
    durationDays: 30,
  },
};

const calculateDueDate = (borrowDate, membershipType) => {
  const rules = BORROWING_RULES[membershipType];
  if (!rules) {
    const error = new Error("Invalid membership type");
    error.status = 400;
    throw error;
  }

  const dueDate = new Date(borrowDate);
  dueDate.setDate(dueDate.getDate() + rules.durationDays);
  return dueDate;
};

const parseBorrowPayload = (payload = {}) => {
  const hasReader = Object.prototype.hasOwnProperty.call(payload, "reader");
  const hasBook = Object.prototype.hasOwnProperty.call(payload, "book");
  const hasBorrowDate = Object.prototype.hasOwnProperty.call(
    payload,
    "borrowDate",
  );
  const hasDueDate = Object.prototype.hasOwnProperty.call(payload, "dueDate");
  const hasReturnDate = Object.prototype.hasOwnProperty.call(
    payload,
    "returnDate",
  );
  const hasStatus = Object.prototype.hasOwnProperty.call(payload, "status");

  const reader =
    hasReader && payload.reader ? String(payload.reader).trim() : "";
  const book = hasBook && payload.book ? String(payload.book).trim() : "";
  const borrowDate = hasBorrowDate ? payload.borrowDate : new Date();
  const dueDate = hasDueDate ? payload.dueDate : null;
  const returnDate = hasReturnDate ? payload.returnDate : null;
  const status =
    hasStatus && payload.status ? String(payload.status).trim() : "Borrowed";
  const notes = payload.notes ? String(payload.notes).trim() : "";

  return {
    reader,
    book,
    borrowDate,
    dueDate,
    returnDate,
    status,
    notes,
    hasReader,
    hasBook,
    hasBorrowDate,
    hasDueDate,
    hasReturnDate,
    hasStatus,
  };
};

const validateBorrowCreate = (payload) => {
  const parsed = parseBorrowPayload(payload);

  if (!parsed.reader) {
    const error = new Error("Reader is required");
    error.status = 400;
    throw error;
  }

  if (!mongoose.Types.ObjectId.isValid(parsed.reader)) {
    const error = new Error("Invalid reader ID");
    error.status = 400;
    throw error;
  }

  if (!parsed.book) {
    const error = new Error("Book is required");
    error.status = 400;
    throw error;
  }

  if (!mongoose.Types.ObjectId.isValid(parsed.book)) {
    const error = new Error("Invalid book ID");
    error.status = 400;
    throw error;
  }

  if (!parsed.borrowDate) {
    const error = new Error("Borrow date is required");
    error.status = 400;
    throw error;
  }

  const borrowDate = new Date(parsed.borrowDate);
  if (isNaN(borrowDate.getTime())) {
    const error = new Error("Invalid borrow date");
    error.status = 400;
    throw error;
  }

  // Due date will be calculated in the controller based on reader's membership type
  let dueDate = null;
  if (parsed.dueDate) {
    dueDate = new Date(parsed.dueDate);
    if (isNaN(dueDate.getTime())) {
      const error = new Error("Invalid due date");
      error.status = 400;
      throw error;
    }
  }

  const validStatuses = ["Borrowed", "Returned", "Overdue"];
  if (!validStatuses.includes(parsed.status)) {
    const error = new Error(
      "Invalid status. Must be Borrowed, Returned, or Overdue",
    );
    error.status = 400;
    throw error;
  }

  return {
    reader: parsed.reader,
    book: parsed.book,
    borrowDate,
    dueDate,
    status: parsed.status,
    notes: parsed.notes || undefined,
  };
};

const validateBorrowUpdate = (payload) => {
  const parsed = parseBorrowPayload(payload);
  const updates = {};

  if (parsed.hasReader) {
    if (!parsed.reader) {
      const error = new Error("Reader cannot be empty");
      error.status = 400;
      throw error;
    }

    if (!mongoose.Types.ObjectId.isValid(parsed.reader)) {
      const error = new Error("Invalid reader ID");
      error.status = 400;
      throw error;
    }

    updates.reader = parsed.reader;
  }

  if (parsed.hasBook) {
    if (!parsed.book) {
      const error = new Error("Book cannot be empty");
      error.status = 400;
      throw error;
    }

    if (!mongoose.Types.ObjectId.isValid(parsed.book)) {
      const error = new Error("Invalid book ID");
      error.status = 400;
      throw error;
    }

    updates.book = parsed.book;
  }

  if (parsed.hasBorrowDate) {
    const borrowDate = new Date(parsed.borrowDate);
    if (isNaN(borrowDate.getTime())) {
      const error = new Error("Invalid borrow date");
      error.status = 400;
      throw error;
    }
    updates.borrowDate = borrowDate;
  }

  if (parsed.hasDueDate) {
    if (parsed.dueDate) {
      const dueDate = new Date(parsed.dueDate);
      if (isNaN(dueDate.getTime())) {
        const error = new Error("Invalid due date");
        error.status = 400;
        throw error;
      }
      updates.dueDate = dueDate;
    }
  }

  if (parsed.hasReturnDate) {
    if (parsed.returnDate) {
      const returnDate = new Date(parsed.returnDate);
      if (isNaN(returnDate.getTime())) {
        const error = new Error("Invalid return date");
        error.status = 400;
        throw error;
      }
      updates.returnDate = returnDate;
    } else {
      updates.returnDate = null;
    }
  }

  if (parsed.hasStatus) {
    if (!parsed.status) {
      const error = new Error("Status cannot be empty");
      error.status = 400;
      throw error;
    }

    const validStatuses = ["Borrowed", "Returned", "Overdue"];
    if (!validStatuses.includes(parsed.status)) {
      const error = new Error(
        "Invalid status. Must be Borrowed, Returned, or Overdue",
      );
      error.status = 400;
      throw error;
    }

    updates.status = parsed.status;
  }

  if (parsed.notes) {
    updates.notes = parsed.notes;
  }

  if (Object.keys(updates).length === 0) {
    const error = new Error("No valid fields to update");
    error.status = 400;
    throw error;
  }

  return updates;
};

module.exports = {
  validateBorrowCreate,
  validateBorrowUpdate,
  calculateDueDate,
  BORROWING_RULES,
};
