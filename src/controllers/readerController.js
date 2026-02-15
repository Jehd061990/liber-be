const Reader = require("../models/Reader");
const {
  validateReaderCreate,
  validateReaderUpdate,
} = require("../validators/readerValidator");

const createReader = async (req, res, next) => {
  try {
    const payload = validateReaderCreate(req.body);

    // Check if reader ID already exists
    const existingReader = await Reader.findOne({ readerId: payload.readerId });
    if (existingReader) {
      return res.status(409).json({ message: "Reader ID already exists" });
    }

    // Check if email already exists
    const existingEmail = await Reader.findOne({ email: payload.email });
    if (existingEmail) {
      return res.status(409).json({ message: "Email already exists" });
    }

    const reader = await Reader.create({
      ...payload,
      createdBy: req.user ? req.user.id : undefined,
    });

    res.status(201).json({
      reader,
    });
  } catch (error) {
    next(error);
  }
};

const listReaders = async (req, res, next) => {
  try {
    const {
      search,
      readerId,
      studentId,
      fullName,
      email,
      phoneNumber,
      membershipType,
      status,
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
          { readerId: { $regex: searchValue, $options: "i" } },
          { studentId: { $regex: searchValue, $options: "i" } },
          { fullName: { $regex: searchValue, $options: "i" } },
          { email: { $regex: searchValue, $options: "i" } },
          { phoneNumber: { $regex: searchValue, $options: "i" } },
          { address: { $regex: searchValue, $options: "i" } },
        ];
      }
    }

    addRegexFilter("readerId", readerId);
    addRegexFilter("studentId", studentId);
    addRegexFilter("fullName", fullName);
    addRegexFilter("email", email);
    addRegexFilter("phoneNumber", phoneNumber);
    addRegexFilter("membershipType", membershipType);
    addRegexFilter("status", status);

    const readers = await Reader.find(filter).sort({ createdAt: -1 });

    res.json({
      readers,
    });
  } catch (error) {
    next(error);
  }
};

const getReaderById = async (req, res, next) => {
  try {
    const reader = await Reader.findById(req.params.id);

    if (!reader) {
      return res.status(404).json({ message: "Reader not found" });
    }

    res.json({
      reader,
    });
  } catch (error) {
    next(error);
  }
};

const updateReader = async (req, res, next) => {
  try {
    const updates = validateReaderUpdate(req.body);

    // If readerId is being updated, check if it already exists
    if (updates.readerId) {
      const existingReader = await Reader.findOne({
        readerId: updates.readerId,
        _id: { $ne: req.params.id },
      });
      if (existingReader) {
        return res.status(409).json({ message: "Reader ID already exists" });
      }
    }

    // If email is being updated, check if it already exists
    if (updates.email) {
      const existingEmail = await Reader.findOne({
        email: updates.email,
        _id: { $ne: req.params.id },
      });
      if (existingEmail) {
        return res.status(409).json({ message: "Email already exists" });
      }
    }

    const reader = await Reader.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    if (!reader) {
      return res.status(404).json({ message: "Reader not found" });
    }

    res.json({
      reader,
    });
  } catch (error) {
    next(error);
  }
};

const deleteReader = async (req, res, next) => {
  try {
    const reader = await Reader.findByIdAndDelete(req.params.id);

    if (!reader) {
      return res.status(404).json({ message: "Reader not found" });
    }

    res.json({ message: "Reader deleted" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createReader,
  listReaders,
  getReaderById,
  updateReader,
  deleteReader,
};
