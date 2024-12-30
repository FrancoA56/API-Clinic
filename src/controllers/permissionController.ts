import { Request, Response } from "express";
import prisma from "../config/prisma";

export const getAllPermissions = async (req: Request, res: Response) => {
  try {
    const permission = await prisma.permission.findMany();
    res.status(200).json(permission);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch permission." });
  }
};

export const createPermission = async (req: Request, res: Response) => {
  const { name } = req.body;
  try {
    const permission = await prisma.permission.create({
        data: {
            name
        }
    });
    res.status(201).json(permission);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create permission." });
  }
};
