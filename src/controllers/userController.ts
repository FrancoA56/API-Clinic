import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import prisma from "../config/prisma";

// Asegúrate de que JWT_SECRET esté correctamente definido
const JWT_SECRET = process.env.JWT_SECRET as string;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in the environment variables.");
}

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ error: "Email and password are required." });
    return;
  }

  try {
    // Buscar al usuario por email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      res.status(401).json({ error: "Invalid email or password." });
      return;
    }

    // Verificar contraseña
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({ error: "Invalid email or password." });
      return;
    }

    // Generar JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: "1h" } // Expira en 1 hora
    );

    res.status(200).json({ token, user: { id: user.id, name: user.name, email: user.email } });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "Failed to log in." });
  }
};

export const createUser = async (req: Request, res: Response): Promise<void> => {
  const {
    name,
    lastname,
    email,
    password, // La contraseña del nuevo usuario
    cuilprefix,
    dni,
    cuilpostfix,
    roles, // Roles asignados al usuario
    doctor, // Datos del doctor, si es necesario
  } = req.body;

  // Validar campos requeridos
  if (!name || !lastname || !email || !dni || !password) {
    res.status(400).json({ error: "Missing required fields for user." });
    return;
  }

  try {
    // Verificar que el usuario no exista
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      res.status(400).json({ error: "User with this email already exists." });
      return;
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear el usuario con roles y datos de doctor, si existen
    let roleConnections = undefined;
    if (roles) {
      if (!Array.isArray(roles)) {
        throw new Error("Roles must be an array of IDs.");
      }
      roleConnections = roles.map((roleId: number) => ({ id: roleId }));
    }

    // Validar datos del doctor, si se proporcionan
    let doctorData = undefined;
    if (doctor) {
      const { matriculaNacional, matriculaProvincial, specialties } = doctor;

      if (!matriculaNacional || !matriculaProvincial) {
        throw new Error("Missing required fields for doctor.");
      }

      // Validar especialidades, si se proporcionan
      let specialtyConnections = undefined;
      if (specialties) {
        if (!Array.isArray(specialties)) {
          throw new Error("Specialties must be an array of IDs.");
        }
        specialtyConnections = specialties.map((specialtyId: number) => ({
          id: specialtyId,
        }));
      }

      doctorData = {
        matriculaNacional,
        matriculaProvincial,
        specialties: specialtyConnections
          ? { connect: specialtyConnections }
          : undefined,
      };
    }

    // Crear el usuario
    const user = await prisma.user.create({
      data: {
        name,
        lastname,
        email,
        password: hashedPassword, // Almacenar la contraseña hasheada
        cuilprefix,
        dni,
        cuilpostfix,
        roles: roleConnections ? { connect: roleConnections } : undefined,
        doctor: doctorData ? { create: doctorData } : undefined,
      },
      include: {
        doctor: true, // Incluir la información del doctor en la respuesta, si corresponde
      },
    });

    res.status(201).json(user); // Respuesta con el usuario creado
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Failed to create user." });
  }
};