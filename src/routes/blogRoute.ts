import express from "express";
import { BlogController } from "../controller/blogController";
import { protectAdmin } from "../middleware/authMiddleware";

const router = express.Router();
const blogController = new BlogController();

router.post("/", protectAdmin, blogController.execute);
router.get("/", blogController.execute);
router.get("/:id", blogController.execute);
router.put("/:id", protectAdmin, blogController.execute);
router.delete("/:id", protectAdmin, blogController.execute);
router.patch("/status/:id", protectAdmin, blogController.execute);

export default router;
