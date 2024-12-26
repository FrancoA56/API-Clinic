import { Router } from "express";
import { getAllPacient, createPacient } from "../controllers/pacientsController";

const router = Router();

router.get("/", getAllPacient);
router.post("/", createPacient);

export default router;
