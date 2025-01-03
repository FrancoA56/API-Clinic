import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in the environment variables.");
}

export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ error: "Authorization token is missing or invalid." });
    return; // Aseguramos que se detenga la ejecución
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any; // Decodifica el token
    req.user = decoded; // Agrega los datos del usuario al objeto `req`
    next(); // Continúa al siguiente middleware
  } catch (err) {
    res.status(403).json({ error: "Invalid or expired token." });
    return; // Detenemos la ejecución
  }
};
