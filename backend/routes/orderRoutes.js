import express from "express";
const router = express.Router();
import {
  addOrderItems,
  getMyOrders,
  getOrderById,
  updateOrderToDelivered,
  updateOrderToPaid,
  getOrders,
} from "../controllers/orderController.js";
import { protect, admin } from "../middlewares/authMiddleware.js";

router.route("/mine").get(protect, getMyOrders);
router.route("/:id/pay").put(protect, updateOrderToPaid);
router.route("/:id").get(protect, getOrderById);
router.route("/:id/deliver").put(protect, admin, updateOrderToDelivered);
router.route("/").post(protect, addOrderItems).get(protect, admin, getOrders);

export default router;
