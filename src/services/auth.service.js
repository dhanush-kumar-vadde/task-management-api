const bcrypt = require("bcrypt");
const crypto = require("crypto");

const User = require("../models/user.model");
const VerificationToken = require("../models/verificationToken.model");
const Session = require("../models/session.model");

const {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken
} = require("../utils/jwt");

/**
 * Register User
 */
const register = async ({ name, email, password }) => {

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new Error("Email already registered");
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    passwordHash
  });

  const token = crypto.randomBytes(32).toString("hex");

  await VerificationToken.create({
    userId: user._id,
    token,
    expiresAt: new Date(Date.now() + 1000 * 60 * 30)
  });

  return {
    message: "Registration successful. Verify your email."
  };
};

/**
 * Verify Email
 */
const verifyEmail = async (token) => {
  const record = await VerificationToken.findOne({ token });

  if (!record) {
    throw new Error("Invalid or expired token");
  }

  if (record.expiresAt < new Date()) {
    throw new Error("Token expired");
  }

  const user = await User.findById(record.userId);

  if (!user) {
    throw new Error("User not found");
  }

  user.verified = true;
  await user.save();

  await VerificationToken.deleteOne({ _id: record._id });

  return { message: "Email verified successfully" };
};

/**
 * Resend Verification
 */
const resendVerification = async (email) => {
  const user = await User.findOne({ email });

  if (!user) {
    return {
      message: "If the email exists, verification link sent"
    };
  }

  if (user.verified) {
    return { message: "Email already verified" };
  }

  await VerificationToken.deleteMany({ userId: user._id });

  const token = crypto.randomBytes(32).toString("hex");

  await VerificationToken.create({
    userId: user._id,
    token,
    expiresAt: new Date(Date.now() + 1000 * 60 * 30)
  });

  return {
    message: "Verification email resent"
  };
};

/**
 * Login
 */
const login = async ({ email, password }, meta) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("Invalid credentials");
  }

  const validPassword = await bcrypt.compare(
    password,
    user.passwordHash
  );

  if (!validPassword) {
    throw new Error("Invalid credentials");
  }

  if (!user.verified) {
    throw new Error("Please verify your email");
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  await Session.create({
    userId: user._id,
    refreshToken,
    userAgent: meta.userAgent,
    ipAddress: meta.ip,
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7)
  });

  return {
    accessToken,
    refreshToken
  };
};

/**
 * Refresh Token
 */
const refresh = async (refreshToken) => {
  const payload = verifyRefreshToken(refreshToken);

  const session = await Session.findOne({
    userId: payload.userId,
    refreshToken
  });

  if (!session) {
    throw new Error("Invalid session");
  }

  const user = await User.findById(payload.userId);

  const accessToken = generateAccessToken(user);

  return { accessToken };
};

/**
 * Logout
 */
const logout = async (refreshToken) => {
  await Session.deleteOne({ refreshToken });

  return { message: "Logged out successfully" };
};

module.exports = {
  register,
  verifyEmail,
  resendVerification,
  login,
  refresh,
  logout
};