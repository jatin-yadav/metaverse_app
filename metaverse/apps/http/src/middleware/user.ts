declare global {
  namespace Express {
    interface Request {
      role?: "Admin" | "User";
      userId: string;
    }
  }
}

import jwt from "jsonwebtoken";
import { JWT_SCRETE_KEY } from "../config";
import { NextFunction, Request, Response } from "express";

export const userMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const headers = req.headers.authorization;
  const token = headers?.split(" ")[1];

  if (!token) {
    res.status(403).json({ message: "Unauthorized" });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SCRETE_KEY) as {
      role: string;
      userId: string;
    };

    req.userId = decoded.userId;
    next();
  } catch (err) {
    res.status(401).json({ message: "Unauthorized" });
  }
};
