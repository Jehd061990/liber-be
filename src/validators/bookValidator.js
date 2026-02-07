const validateBookCreate = (payload = {}) => {
  const title = payload.title ? payload.title.trim() : "";
  const author = payload.author ? payload.author.trim() : "";
  const description = payload.description ? payload.description.trim() : "";
  const genre = payload.genre ? payload.genre.trim() : "";
  const coverUrl = payload.coverUrl ? payload.coverUrl.trim() : "";
  const publishedYear = payload.publishedYear;

  if (!title || !author) {
    const error = new Error("Title and author are required");
    error.status = 400;
    throw error;
  }

  if (publishedYear && Number.isNaN(Number(publishedYear))) {
    const error = new Error("Published year must be a number");
    error.status = 400;
    throw error;
  }

  return {
    title,
    author,
    description,
    genre,
    coverUrl,
    publishedYear: publishedYear ? Number(publishedYear) : undefined,
  };
};

module.exports = {
  validateBookCreate,
};
