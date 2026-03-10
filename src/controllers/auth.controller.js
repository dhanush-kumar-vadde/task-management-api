const authService = require("../services/auth.service");

/**
 * Register
 */
const register = async (req, res, next) => {
  try {
    const result = await authService.register(req.body);

    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

/**
 * Verify Email
 */
const verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.query;

    const result = await authService.verifyEmail(token);

    res.json(result);
  } catch (error) {
    next(error);
  }
};

/**
 * Resend Verification
 */
const resendVerification = async (req, res, next) => {
  try {
    const { email } = req.body;

    const result = await authService.resendVerification(email);

    res.json(result);
  } catch (error) {
    next(error);
  }
};

/**
 * Login
 */
const login = async (req, res, next) => {
  try {
    const meta = {
      userAgent: req.headers["user-agent"],
      ip: req.ip
    };

    const { accessToken, refreshToken } =
      await authService.login(req.body, meta);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false, 
      sameSite: "strict"
    });

    res.json({ accessToken });
  } catch (error) {
    next(error);
  }
};

/**
 * Refresh Access Token
 */
const refresh = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;

    const result = await authService.refresh(refreshToken);

    res.json(result);
  } catch (error) {
    next(error);
  }
};

/**
 * Logout
 */
const logout = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;

    await authService.logout(refreshToken);

    res.clearCookie("refreshToken");

    res.json({ message: "Logged out successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  verifyEmail,
  resendVerification,
  login,
  refresh,
  logout
};