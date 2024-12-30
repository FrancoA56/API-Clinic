import { Request, Response } from "express";
import prisma from "../config/prisma";

export const getPracticeValue = async (req: Request, res: Response) => {
    try {
        const { id: practiceId } = req.params;

        const practice = await prisma.practice.findUnique({
            where: { id: Number(practiceId) },
            include: {
                practiceCodes: {
                    include: {
                        code: true, // Incluye valores base del código
                        social: true, // Incluye la obra social asociada
                    },
                },
            },
        });

        if (!practice) {
            return res.status(404).json({ error: "Practice not found." });
        }

        const result = practice.practiceCodes.map((pc) => {
            const baseValue = pc.code.honorario + pc.code.gastos;
            const totalValue = pc.forcedValue ?? baseValue * (pc.multiplier || 1);
            return {
                codeName: pc.code.name,
                socialName: pc.social.name,
                totalValue,
            };
        });

        return res.status(200).json({ practice, calculatedValues: result });
    } catch (error) {
        console.error("Error fetching practice:", error);
        return res.status(500).json({ error: "Failed to fetch practice." });
    }
};
