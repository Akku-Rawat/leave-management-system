// config/auth.js
module.exports = {
  jwtSecret: process.env.JWT_SECRET || "supersecretkey",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
};
