import { NextFunction, Request, Response, Router } from "express";
import { adminLoginBody } from "../../shared/validators/adminValidator";
import { database } from "../mongodb_connection/connection";
import { AdminModel } from "../models/adminModel";
import config, { CollectionListNames } from "../config/config";
import jwt from "jsonwebtoken";
import { matchPassword } from "../tools/passwordEncrypter";

const adminRouter = Router();

// Login route
adminRouter.post(
  "/login",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userName, password } = adminLoginBody.parse(req.body);
      const user = await database
        .collection<AdminModel>(CollectionListNames.ELECTION_COMMISSION_ADMIN)
        .findOne({
          userName: userName,
        });

      if (!user) {
        return res.status(401).json({
          message: "User does not exists",
        });
      }
      const response = await matchPassword(password, user?.password);

      if (!response)
        return res.status(401).json({
          message: "Incorrect password",
        });

      const token = jwt.sign({ userId: user._id }, config.jwtPrivateKey, {
        expiresIn: "1h",
      });

      return res.status(200).json({
        token: token,
        message: "Login Successful",
        data: {
          userEmail: user?.userEmail,
          userName: user?.userName,
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

export default adminRouter;
