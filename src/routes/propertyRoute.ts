import { Router } from "express";
import { PropertyController } from "../controller/propertyController";
import { protectAdmin } from "../middleware/authMiddleware";

const router = Router();
const propertyController = new PropertyController();

router.post("/",protectAdmin, propertyController.execute);
router.get("/", propertyController.execute);
router.get("/:id", propertyController.execute);
router.put("/:id",protectAdmin, propertyController.execute);
router.delete("/:id", protectAdmin,propertyController.execute);

export default router;
