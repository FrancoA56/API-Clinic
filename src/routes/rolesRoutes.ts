import { Router } from "express";
import { getAllRoles, createRole } from "../controllers/rolesController";

const router = Router();

router.get("/", getAllRoles);
router.post("/", createRole);

export default router;
