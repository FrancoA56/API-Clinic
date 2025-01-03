import { Request, Response, NextFunction } from "express";

export const authorize = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const user = req.user; // Asegúrate de que `req.user` esté configurado por el middleware `authenticate`

    if (!user) {
      res.status(401).json({ error: "User is not authenticated." });
      return;
    }

    if (!roles.includes(user.role)) {
      res.status(403).json({ error: "User does not have the required permissions." });
      return;
    }

    next(); // Continúa al siguiente middleware o controlador
  };
};
