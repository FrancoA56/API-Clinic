import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import prisma from "../config/prisma";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: string;
        [key: string]: any; // Otros campos del usuario si es necesario
      };
    }
  }
}


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
      include: {
        roles: {
          include: {
            permissions: true,
          },
        },
      },
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

    // Crear un arreglo con los nombres de los permisos
    const permissions = user.roles
      .flatMap((role) => role.permissions)
      .map((permission) => permission.name);

    // Generar JWT
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        roles: user.roles.map((role) => role.name),
        permissions,
      },
      JWT_SECRET,
      { expiresIn: "1h" } // Expira en 1 hora
    );

    res.status(200).json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        roles: user.roles.map((role) => role.name),
        permissions,
      },
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "Failed to log in." });
  }
};

export const createUser = async (
  req: Request,
  res: Response
): Promise<void> => {
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

    const user = await prisma.user.create({
      data: {
        name,
        lastname,
        email,
        password: hashedPassword, // Almacenar la contraseña hasheada
        cuilprefix,
        dni,
        cuilpostfix,
        roles: { connect: roles?.map((roleId: number) => ({ id: roleId })) },
        doctor: doctor
          ? {
              create: {
                matriculaNacional: doctor.matriculaNacional,
                matriculaProvincial: doctor.matriculaProvincial,
                specialties: {
                  connect: doctor.specialties?.map((id: number) => ({ id })),
                },
              },
            }
          : undefined,
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


