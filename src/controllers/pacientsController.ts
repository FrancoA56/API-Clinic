import { Request, Response } from "express";
import prisma from "../config/prisma";

export const getAllPacient = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const Pacient = await prisma.pacient.findMany();
    res.status(200).json(Pacient);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch roles." });
  }
};

export const createPacient = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { name, lastname, dni, socialNumber, socials } = req.body;
  try {
    if (!name || !lastname || !dni || !socialNumber || !socials) {
      res.status(400).json({ error: "Missing required fields for pacient." });
      return;
    }
    let socialConnections = undefined;
    if (socials) {
      if (!Array.isArray(socials)) {
        throw new Error("Socials must be an array of IDs.");
      }
      socialConnections = socials.map((socialId: number) => ({ id: socialId }));
    }
    const Pacient = await prisma.pacient.create({
      data: {
        name,
        lastname,
        dni,
        socialNumber,
        socials: socialConnections ? { connect: socialConnections } : undefined,
      },
    });
    res.status(201).json(Pacient);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create Pacient." });
  }
};
