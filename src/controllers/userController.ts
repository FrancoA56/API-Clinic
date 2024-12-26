import { Request, Response } from "express";
import prisma from "../config/prisma";

export const getAllUsers = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const users = await prisma.user.findMany();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch users." });
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
    cuilprefix,
    dni,
    cuilpostfix,
    roles,
    doctor, // Datos del doctor, si se proporcionan
  } = req.body;

  // Validar campos requeridos para el usuario
  if (!name || !lastname || !email || !dni) {
    res.status(400).json({ error: "Missing required fields for user." });
    return;
  }

  try {
    // Validar roles, si se proporcionan
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

    // Crear el usuario con roles y datos de doctor, si existen
    const user = await prisma.user.create({
      data: {
        name,
        lastname,
        email,
        cuilprefix,
        dni,
        cuilpostfix,
        roles: roleConnections ? { connect: roleConnections } : undefined,
        doctor: doctorData ? { create: doctorData } : undefined,
      },
      include: {
        doctor: true, // Incluimos la información del doctor en la respuesta
      },
    });

    res.status(201).json(user);
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Failed to create user." });
  }
};
