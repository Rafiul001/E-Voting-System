import { NextFunction, Request, Response, Router } from "express";
import { adminLoginBody } from "../../shared/validators/adminValidator";
import { database } from "../mongodb_connection/connection";
import { AdminModel } from "../models/adminModel";
import config, { CollectionListNames } from "../config/config";
import jwt from "jsonwebtoken";
import { matchPassword } from "../tools/passwordEncrypter";
import { OperatorModel } from "../models/operatorModel";
import { MachineModel } from "../models/machineModel";

const authRouter = Router();

// Login route
authRouter.post(
  "/login",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userName, password, type } = adminLoginBody.parse(req.body);

      if (type === "admin") {
        const user = await database
          .collection<AdminModel>(CollectionListNames.DISTRICT_COMMISSION_ADMIN)
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
      } else if (type === "operator") {
        const operator = await database
          .collection<OperatorModel>(CollectionListNames.OPERATOR)
          .findOne({
            operatorId: userName,
          });

        if (!operator) {
          return res.status(401).json({
            message: "Operator does not exists",
          });
        }

        if (password !== operator.operatorPassword)
          return res.status(401).json({
            message: "Incorrect password",
          });

        if (operator.isRevoked)
          return res.status(401).json({
            message: "Operator is revoked!",
          });

        const token = jwt.sign({ userId: operator._id }, config.jwtPrivateKey, {
          expiresIn: "1h",
        });

        return res.status(200).json({
          token: token,
          message: "Login Successful",
          data: {
            userName: operator?.operatorId,
          },
        });
      } else if (type === "machine") {
        const machine = await database
          .collection<MachineModel>(CollectionListNames.MACHINE)
          .findOne({
            machineId: userName,
          });

        if (!machine) {
          return res.status(401).json({
            message: "machine does not exists",
          });
        }

        if (password !== machine.machinePassword)
          return res.status(401).json({
            message: "Incorrect password",
          });

        const token = jwt.sign({ userId: machine._id }, config.jwtPrivateKey, {
          expiresIn: "1h",
        });

        return res.status(200).json({
          token: token,
          message: "Login Successful",
          data: {
            userName: machine.machineId,
            divisionName: machine.divisionName,
            districtName: machine.districtName,
            constituencyNumber: machine.constituencyNumber,
            constituencyName: machine.constituencyName,
          },
        });
      } else {
        return res.json({
          token: null,
          message: "There is no type found!",
          data: null,
        });
      }
    } catch (error) {
      next(error);
    }
  }
);

export default authRouter;
