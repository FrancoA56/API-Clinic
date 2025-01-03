import { Router } from "express";
import { loginUser, createUser } from "../controllers/userController";
import { authenticate } from "../middlewares/authenticate";
import { authorize } from "../middlewares/authorize";

const router = Router();

// Ruta pública (sin autenticación)
router.post("/login", loginUser);

// Ruta protegida para crear un usuario (requiere autenticación y permisos específicos)
router.post(
  "/create",
  authenticate, // Verifica que el usuario esté autenticado
  authorize(["admin"]), // Solo los usuarios con el permiso "admin" pueden acceder
  createUser
);

export default router;
