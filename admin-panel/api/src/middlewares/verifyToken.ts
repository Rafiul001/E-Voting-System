import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config/config";

export const verifyToken = async (
  req: Request & { userId?: string },
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ message: "Unauthorized Access!" });

  jwt.verify(token, config.jwtPrivateKey, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Invalid or expired token" });
    }
    const payload = decoded as JwtPayload & { userId?: string };
    if (payload.userId) {
      req.userId = payload.userId;
    }
    return next();
  });
};
