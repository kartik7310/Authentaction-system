import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
const router = express.Router();
import {
  signup,
  login,
  logout,
  verifyToken,
  forgotPassword,
  resetPassword
} from "../controllers/auth.contoller.js";
router.post("/auth/signup", signup);
router.post("/auth/login", login);
router.post("/auth/logout",authMiddleware, logout);
router.post("/auth/verify-code", verifyToken);
router.post("/auth/forgot-password", forgotPassword);
router.post("/auth/reset-password/:token", resetPassword);
// router.post("/auth/login",login)
// router.post("/auth/logout",logout)
export default router;
