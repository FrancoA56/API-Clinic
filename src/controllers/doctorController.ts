import { Request, Response } from "express";
import prisma from "../config/prisma";

export const getAllDoctors = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const doctors = await prisma.doctor.findMany();
    res.status(200).json(doctors);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch users." });
  }
};

export const getDoctorBySpeciality = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { idSpeciality } = req.params;

  try {
    const doctors = await prisma.doctor.findMany({
      where: {
        specialties: {
          some: { id: parseInt(idSpeciality) },
        },
      },
      include: {
        specialties: true, // Incluir las especialidades para verlas en la respuesta (opcional)
      },
    });
    if (doctors.length === 0) {
      res.status(404).json({ message: "No doctors found for this specialty." });
      return;
    }
    res.status(200).json(doctors);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch users." });
  }
};
