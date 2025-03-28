"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const blogController_1 = require("../controller/blogController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
const blogController = new blogController_1.BlogController();
router.post("/", authMiddleware_1.protectAdmin, blogController.execute);
router.get("/", blogController.execute);
router.get("/:id", blogController.execute);
router.put("/:id", authMiddleware_1.protectAdmin, blogController.execute);
router.delete("/:id", authMiddleware_1.protectAdmin, blogController.execute);
router.patch("/status/:id", authMiddleware_1.protectAdmin, blogController.execute);
router.get("/published", blogController.execute);
exports.default = router;
