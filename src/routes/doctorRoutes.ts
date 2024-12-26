import { Router } from "express";
import { getAllDoctors } from "../controllers/doctorController";

const router = Router();

router.get("/", getAllDoctors);

export default router;
