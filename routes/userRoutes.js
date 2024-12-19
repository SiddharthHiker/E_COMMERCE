import express, { Router } from "express";
import {
  getUserProfileController,
  loginController,
  logoutController,
  passwordResetControllers,
  registerController,
  updatedPasswordControllers,
  updateProfileController,
  updateProfilePicControllers,
} from "../controllers/userControllers.js";
import { isAuth } from "../middlewares/authMiddleware.js";
import rateLimit from "../middlewares/rateLimiter.js";
import { singleUpload } from "../middlewares/multer.js";

// router object
const router = express.Router();

// routes
// Register
router.post("/register", rateLimit, registerController);

//Login
router.post("/login", rateLimit, loginController);

// Profile
router.get("/profile", isAuth, getUserProfileController);

//Logout
router.get("/logout", isAuth, logoutController);

// Update user Profile
router.put("/update", isAuth, updateProfileController);

// Updated Password
router.put("/updatePassword", isAuth, updatedPasswordControllers);

// Update Profile pic
router.put(
  "/update-picture",
  isAuth,
  singleUpload,
  updateProfilePicControllers
);

// forgot pasword
router.post("/reset-password", isAuth, passwordResetControllers);
// export
export default router;
