import { Request, Response } from "express";
import prisma from "../config/prisma";

export const getAllRoles = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const roles = await prisma.role.findMany();
    res.status(200).json(roles);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch roles." });
  }
};

export const createRole = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { name } = req.body;
  try {
    const role = await prisma.role.create({
      data: {
        name,
      },
    });
    res.status(201).json(role);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create role." });
  }
};
