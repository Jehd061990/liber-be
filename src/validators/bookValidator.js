const parseBookPayload = (payload = {}) => {
  const hasTitle = Object.prototype.hasOwnProperty.call(payload, "title");
  const hasBookAuthor =
    Object.prototype.hasOwnProperty.call(payload, "bookAuthor") ||
    Object.prototype.hasOwnProperty.call(payload, "author");

  const title = hasTitle && payload.title ? payload.title.trim() : "";
  const bookAuthor = hasBookAuthor
    ? payload.bookAuthor
      ? payload.bookAuthor.trim()
      : payload.author
        ? payload.author.trim()
        : ""
    : "";
  const description = payload.description ? payload.description.trim() : "";
  const genre = payload.genre ? payload.genre.trim() : "";
  const coverImage = payload.coverImage
    ? payload.coverImage.trim()
    : payload.coverUrl
      ? payload.coverUrl.trim()
      : "";
  const isbn = payload.isbn ? payload.isbn.trim() : "";
  const publisher = payload.publisher ? payload.publisher.trim() : "";
  const category = payload.category ? payload.category.trim() : "";
  const barcode = payload.barcode ? payload.barcode.trim() : "";
  const qrCode = payload.qrCode ? payload.qrCode.trim() : "";
  const shelfLocation = payload.shelfLocation
    ? payload.shelfLocation.trim()
    : "";
  const status = payload.status ? payload.status.trim() : "";
  const availableCopies = payload.availableCopies;
  const totalCopies = payload.totalCopies;
  const publishedYear = payload.publishedYear;

  if (publishedYear && Number.isNaN(Number(publishedYear))) {
    const error = new Error("Published year must be a number");
    error.status = 400;
    throw error;
  }

  if (availableCopies !== undefined && Number.isNaN(Number(availableCopies))) {
    const error = new Error("Available copies must be a number");
    error.status = 400;
    throw error;
  }

  if (totalCopies !== undefined && Number.isNaN(Number(totalCopies))) {
    const error = new Error("Total copies must be a number");
    error.status = 400;
    throw error;
  }

  return {
    title: hasTitle ? title : undefined,
    bookAuthor: hasBookAuthor ? bookAuthor : undefined,
    description: payload.description !== undefined ? description : undefined,
    genre: payload.genre !== undefined ? genre : undefined,
    coverImage:
      payload.coverImage !== undefined || payload.coverUrl !== undefined
        ? coverImage
        : undefined,
    isbn: payload.isbn !== undefined ? isbn : undefined,
    publisher: payload.publisher !== undefined ? publisher : undefined,
    category: payload.category !== undefined ? category : undefined,
    barcode: payload.barcode !== undefined ? barcode : undefined,
    qrCode: payload.qrCode !== undefined ? qrCode : undefined,
    shelfLocation:
      payload.shelfLocation !== undefined ? shelfLocation : undefined,
    status: payload.status !== undefined ? status : undefined,
    availableCopies:
      availableCopies !== undefined ? Number(availableCopies) : undefined,
    totalCopies: totalCopies !== undefined ? Number(totalCopies) : undefined,
    publishedYear: publishedYear ? Number(publishedYear) : undefined,
  };
};

const validateBookCreate = (payload = {}) => {
  const parsed = parseBookPayload(payload);

  if (!parsed.title || !parsed.bookAuthor) {
    const error = new Error("Title and book author are required");
    error.status = 400;
    throw error;
  }

  return parsed;
};

const validateBookUpdate = (payload = {}) => {
  const parsed = parseBookPayload(payload);
  const hasUpdates = Object.values(parsed).some((value) => value !== undefined);

  if (!hasUpdates) {
    const error = new Error("At least one field is required to update");
    error.status = 400;
    throw error;
  }

  return parsed;
};

module.exports = {
  validateBookCreate,
  validateBookUpdate,
};
