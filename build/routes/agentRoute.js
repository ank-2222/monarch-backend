"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const agentController_1 = require("../controller/agentController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
const agentController = new agentController_1.AgentController();
router.post("/", authMiddleware_1.protectAdmin, agentController.execute);
router.get("/", agentController.execute);
router.get("/:id", agentController.execute);
router.put("/:id", authMiddleware_1.protectAdmin, agentController.execute);
router.delete("/:id", authMiddleware_1.protectAdmin, agentController.execute);
exports.default = router;
