import express from "express";
import { isAdmin, isAuth } from "../middlewares/authMiddleware.js";
import {
  changeOrderStatusController,
  createOrderController,
  getAllOrdersController,
  getMyOrdersController,
  paymentsController,
  singleOrderDetailsControllers,
} from "../controllers/orderControllers.js";

const router = express.Router();

// ================ Order Router =======================

// Create Order Routes
router.post("/create", isAuth, isAdmin, createOrderController);

// Get Order Details
router.get("/my-order", isAuth, getMyOrdersController);

// get SingleOrderDetail
router.get("/my-order/:id", isAuth, singleOrderDetailsControllers);

// Accept Payment
router.post("/payments", isAuth, paymentsController);

// ========================== ADMIN PART ==================================
// Get All order
router.get("/admin/get-all-order", isAuth, isAdmin, getAllOrdersController);

// Change ORDER Status

router.post("/admin/order/:id", isAuth, isAdmin, changeOrderStatusController);

export default router;
