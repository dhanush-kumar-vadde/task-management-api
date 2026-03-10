const jwt = require("jsonwebtoken");

/**
 * Generate Access Token
 * short lived
 */
const generateAccessToken = (user) => {
  return jwt.sign(
    {
      userId: user._id,
      role: user.platformRole
    },
    process.env.JWT_SECRET,
    { expiresIn: "15m" }
  );
};

/**
 * Generate Refresh Token
 * long lived
 */
const generateRefreshToken = (user) => {
  return jwt.sign(
    {
      userId: user._id
    },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "7d" }
  );
};

/**
 * Verify Access Token
 */
const verifyAccessToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

/**
 * Verify Refresh Token
 */
const verifyRefreshToken = (token) => {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken
};