import express from "express";
import { AgentController } from "../controller/agentController";
import { protectAdmin } from "../middleware/authMiddleware";

const router = express.Router();
const agentController = new AgentController();

router.post("/", protectAdmin, agentController.execute);
router.get("/", agentController.execute);
router.get("/:id", agentController.execute);
router.put("/:id", protectAdmin, agentController.execute);
router.delete("/:id", protectAdmin, agentController.execute);

export default router;
