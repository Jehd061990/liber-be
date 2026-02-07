const normalizeEmail = (email) => email.toLowerCase().trim();

const validateLogin = (payload = {}) => {
  const email = payload.email ? normalizeEmail(payload.email) : "";
  const password = payload.password ? payload.password.trim() : "";

  if (!email || !password) {
    const error = new Error("Email and password are required");
    error.status = 400;
    throw error;
  }

  return { email, password };
};

const validateRegister = (payload = {}) => {
  const name = payload.name ? payload.name.trim() : "";
  const email = payload.email ? normalizeEmail(payload.email) : "";
  const password = payload.password ? payload.password.trim() : "";

  if (!name || !email || !password) {
    const error = new Error("Name, email, and password are required");
    error.status = 400;
    throw error;
  }

  if (password.length < 6) {
    const error = new Error("Password must be at least 6 characters");
    error.status = 400;
    throw error;
  }

  return { name, email, password };
};

module.exports = {
  validateLogin,
  validateRegister,
};
