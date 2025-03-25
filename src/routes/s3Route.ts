import express from "express";
import { getPresignedUrl } from "../service/s3Service";

const router = express.Router();
router.post("/s3-upload-url", getPresignedUrl);

export default router;
