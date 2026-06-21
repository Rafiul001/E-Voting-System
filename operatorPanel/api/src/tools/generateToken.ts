import jwt from "jsonwebtoken";
import config from "../config/config";

export const generateToken = (userId: string): string => {
  const accessToken = jwt.sign(
    { userId },
    config.jwtPrivateKey,
    { expiresIn: "1h" } // short-lived
  );

  return accessToken;
};
