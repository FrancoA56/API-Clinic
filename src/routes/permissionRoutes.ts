import { Router } from "express";
import { getAllPermissions, createPermission } from "../controllers/permissionController";

const router = Router();

router.get("/", getAllPermissions);
router.post("/", createPermission);

export default router;
