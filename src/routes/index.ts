import { Router } from "express";
import userRoutes from "./userRoutes";
import doctorRoutes from "./doctorRoutes";
import rolesRoutes from "./rolesRoutes";
import specialtyRoutes from "./specialtiesRoutes";
import permissionRoutes from "./permissionRoutes";
import socialRoutes from "./socialRoutes";
import pacientsRoutes from "./pacientsRoutes";

const router = Router();

// Registrar rutas  
router.use("/users", userRoutes); // Ruta base: /api/users
router.use("/doctors", doctorRoutes); // Ruta base: /api/doctors
router.use("/roles", rolesRoutes); // Ruta base: /api/roles
router.use("/specialties", specialtyRoutes); // Ruta base: /api/specialties
router.use("/permission", permissionRoutes); // Ruta base: /api/permission
router.use("/social", socialRoutes); // Ruta base: /api/social
router.use("/pacients", pacientsRoutes); // Ruta base: /api/pacients

export default router;
