import { Router } from "express";
import { getAllSpecialties, createSpecialty } from "../controllers/specialtiesController";

const router = Router();

router.get("/", getAllSpecialties);
router.post("/", createSpecialty);    

export default router;