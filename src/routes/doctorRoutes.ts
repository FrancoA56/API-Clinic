import { Router } from "express";
import { getAllDoctors, getDoctorBySpeciality } from "../controllers/doctorController";

const router = Router();

router.get("/", getAllDoctors);
router.get("/:idSpeciality", getDoctorBySpeciality);

export default router;
