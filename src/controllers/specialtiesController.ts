import { Request, Response } from "express";
import prisma from "../config/prisma";

export const getAllSpecialties = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const specialties = await prisma.specialty.findMany({
      orderBy: {
        name: "asc",
      },
    });
    res.status(200).json(specialties);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch specialties." });
  }
};

export const createSpecialty = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    if (!name) {
      res.status(400).json({ error: "Missing required field: name." });
      return;
    }
    const specialty = await prisma.specialty.create({
      data: {
        name,
      },
    });
    res.status(200).json(specialty);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch specialties." });
  }
};
