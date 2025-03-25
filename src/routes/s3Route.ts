import express from "express";
import { getPresignedUrl } from "../service/s3Service";
import { protectAdmin } from "../middleware/authMiddleware";

const router = express.Router();
router.post("/s3-upload-url",protectAdmin, getPresignedUrl);

export default router;
