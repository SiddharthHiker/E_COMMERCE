import express from "express";
import { isAdmin, isAuth } from "../middlewares/authMiddleware.js";
import {
  createCategory,
  deleteCategoryController,
  getAllCategory,
  updateCategoryController,
} from "../controllers/categoryControllers.js";

const router = express.Router();
//    ===================== CATEGORY ROUTES =====================
// create category
router.post("/create", isAuth, isAdmin, createCategory);

// get all category
router.get("/get-all", getAllCategory);

// delete category
router.delete("/delete/:id", isAuth, isAdmin, deleteCategoryController);

// UPDATE ALL CATEGORY
router.put("/update/:id", isAuth, isAdmin, updateCategoryController);

export default router;
