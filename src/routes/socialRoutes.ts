import { Router } from "express";
import { getAllSocials, createSocial } from "../controllers/socialController";

const router = Router();

router.get("/", getAllSocials);
router.post("/", createSocial);

export default router;
