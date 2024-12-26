import { Request, Response } from "express";
import prisma from "../config/prisma";

export const getAllSocials = async (req: Request, res: Response) => {
  try {
    const Socials = await prisma.social.findMany();
    res.status(200).json(Socials);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch roles." });
  }
};

export const createSocial = async (req: Request, res: Response) => {
  const { name, cuil } = req.body;
  try {
    const Socials = await prisma.social.create({
        data: {
            name,
            cuil
        }
    });
    res.status(201).json(Socials);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create social." });
  }
};
