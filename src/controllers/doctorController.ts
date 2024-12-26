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
