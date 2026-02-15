const parseReaderPayload = (payload = {}) => {
  const hasReaderId = Object.prototype.hasOwnProperty.call(payload, "readerId");
  const hasFullName = Object.prototype.hasOwnProperty.call(payload, "fullName");
  const hasEmail = Object.prototype.hasOwnProperty.call(payload, "email");
  const hasPhoneNumber = Object.prototype.hasOwnProperty.call(
    payload,
    "phoneNumber",
  );
  const hasMembershipType = Object.prototype.hasOwnProperty.call(
    payload,
    "membershipType",
  );
  const hasStatus = Object.prototype.hasOwnProperty.call(payload, "status");

  const readerId =
    hasReaderId && payload.readerId ? payload.readerId.trim() : "";
  const studentId = payload.studentId ? payload.studentId.trim() : "";
  const fullName =
    hasFullName && payload.fullName ? payload.fullName.trim() : "";
  const email =
    hasEmail && payload.email ? payload.email.trim().toLowerCase() : "";
  const phoneNumber =
    hasPhoneNumber && payload.phoneNumber ? payload.phoneNumber.trim() : "";
  const membershipType =
    hasMembershipType && payload.membershipType
      ? payload.membershipType.trim()
      : "";
  const status = hasStatus && payload.status ? payload.status.trim() : "Active";
  const address = payload.address ? payload.address.trim() : "";

  return {
    readerId,
    studentId,
    fullName,
    email,
    phoneNumber,
    membershipType,
    status,
    address,
    hasReaderId,
    hasFullName,
    hasEmail,
    hasPhoneNumber,
    hasMembershipType,
    hasStatus,
  };
};

const validateReaderCreate = (payload) => {
  const parsed = parseReaderPayload(payload);

  if (!parsed.readerId) {
    const error = new Error("Reader ID is required");
    error.status = 400;
    throw error;
  }

  if (!parsed.fullName) {
    const error = new Error("Full name is required");
    error.status = 400;
    throw error;
  }

  if (!parsed.email) {
    const error = new Error("Email is required");
    error.status = 400;
    throw error;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(parsed.email)) {
    const error = new Error("Invalid email format");
    error.status = 400;
    throw error;
  }

  if (!parsed.phoneNumber) {
    const error = new Error("Phone number is required");
    error.status = 400;
    throw error;
  }

  if (!parsed.membershipType) {
    const error = new Error("Membership type is required");
    error.status = 400;
    throw error;
  }

  const validMembershipTypes = ["Student", "Teacher", "Staff"];
  if (!validMembershipTypes.includes(parsed.membershipType)) {
    const error = new Error(
      "Invalid membership type. Must be Student, Teacher, or Staff",
    );
    error.status = 400;
    throw error;
  }

  if (!parsed.status) {
    const error = new Error("Status is required");
    error.status = 400;
    throw error;
  }

  const validStatuses = ["Active", "Inactive", "Suspended"];
  if (!validStatuses.includes(parsed.status)) {
    const error = new Error(
      "Invalid status. Must be Active, Inactive, or Suspended",
    );
    error.status = 400;
    throw error;
  }

  return {
    readerId: parsed.readerId,
    studentId: parsed.studentId || undefined,
    fullName: parsed.fullName,
    email: parsed.email,
    phoneNumber: parsed.phoneNumber,
    membershipType: parsed.membershipType,
    status: parsed.status,
    address: parsed.address || undefined,
  };
};

const validateReaderUpdate = (payload) => {
  const parsed = parseReaderPayload(payload);
  const updates = {};

  if (parsed.hasReaderId && parsed.readerId) {
    updates.readerId = parsed.readerId;
  }

  if (parsed.studentId) {
    updates.studentId = parsed.studentId;
  }

  if (parsed.hasFullName && parsed.fullName) {
    updates.fullName = parsed.fullName;
  }

  if (parsed.hasEmail) {
    if (!parsed.email) {
      const error = new Error("Email cannot be empty");
      error.status = 400;
      throw error;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(parsed.email)) {
      const error = new Error("Invalid email format");
      error.status = 400;
      throw error;
    }

    updates.email = parsed.email;
  }

  if (parsed.hasPhoneNumber && parsed.phoneNumber) {
    updates.phoneNumber = parsed.phoneNumber;
  }

  if (parsed.hasMembershipType && parsed.membershipType) {
    const validMembershipTypes = ["Student", "Teacher", "Staff"];
    if (!validMembershipTypes.includes(parsed.membershipType)) {
      const error = new Error(
        "Invalid membership type. Must be Student, Teacher, or Staff",
      );
      error.status = 400;
      throw error;
    }
    updates.membershipType = parsed.membershipType;
  }

  if (parsed.hasStatus && parsed.status) {
    const validStatuses = ["Active", "Inactive", "Suspended"];
    if (!validStatuses.includes(parsed.status)) {
      const error = new Error(
        "Invalid status. Must be Active, Inactive, or Suspended",
      );
      error.status = 400;
      throw error;
    }
    updates.status = parsed.status;
  }

  if (parsed.address) {
    updates.address = parsed.address;
  }

  if (Object.keys(updates).length === 0) {
    const error = new Error("No valid fields to update");
    error.status = 400;
    throw error;
  }

  return updates;
};

module.exports = {
  validateReaderCreate,
  validateReaderUpdate,
};
