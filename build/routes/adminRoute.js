"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const adminController_1 = require("../controller/adminController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
const adminController = new adminController_1.AdminController();
router.post("/register", adminController.execute); // (Optional)
router.post("/login", adminController.execute);
router.get("/profile", authMiddleware_1.protectAdmin, adminController.execute);
router.put("/profile", authMiddleware_1.protectAdmin, adminController.execute);
router.post("/logout", adminController.execute);
exports.default = router;
