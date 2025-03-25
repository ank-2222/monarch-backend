"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const s3Service_1 = require("../service/s3Service");
const router = express_1.default.Router();
router.post("/s3-upload-url", s3Service_1.getPresignedUrl);
exports.default = router;
