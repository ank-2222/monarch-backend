import express from "express";
import { AdminController } from "../controller/adminController";
import { protectAdmin } from "../middleware/authMiddleware";

const router = express.Router();
const adminController = new AdminController();

router.post("/register", adminController.execute); // (Optional)
router.post("/login", adminController.execute);
router.get("/profile", protectAdmin, adminController.execute);
router.put("/profile", protectAdmin, adminController.execute);
router.post("/logout", adminController.execute);

export default router;
