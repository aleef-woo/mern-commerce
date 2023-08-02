import express from "express";
const router = express.Router();

import {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  getUserByID,
  deleteUser,
  updateUser,
} from "../controllers/userController.js";
import { admin, protect } from "../middlewares/authMiddleware.js";

router.post("/logout", logoutUser);
router.post("/auth", authUser);

//Route with protect permission
router
  .route("/profile")
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

//Route with admin permission
router.route("/").post(registerUser).get(protect, admin, getUsers);
router
  .route("/:id")
  .delete(protect, admin, deleteUser)
  .get(protect, admin, getUserByID)
  .put(protect, admin, updateUser);

export default router;
