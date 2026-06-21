import { NextFunction, Request, Response, Router } from "express";
import { verifyToken } from "../middlewares/verifyToken";
import { createUser, revokeUser } from "../networkConnection/networkConnection";
import { database } from "../mongodb_connection/connection";
import { CollectionListNames } from "../config/config";
import { OperatorModel } from "../models/operatorModel";

const operatorRouter = Router();

// Get All Operators
operatorRouter.get(
  "/get-all",
//   verifyToken,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const operatorArray = await database
        .collection<OperatorModel>(CollectionListNames.OPERATOR)
        .find()
        .toArray();

      return res.json({
        message: "Successfully get all the operators",
        data: operatorArray,
      });
    } catch (error) {
      next(error);
    }
  }
);

// Create Operator
operatorRouter.post(
  "/create",
  verifyToken,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { operatorId, operatorPassowrd } = req.body;

      const existingOperator = await database
        .collection<OperatorModel>(CollectionListNames.OPERATOR)
        .findOne({ operatorId: operatorId });

      if (existingOperator) {
        if (existingOperator.isRevoked)
          return res.json({
            message: "This user is revoked!",
            data: null,
          });
        else
          return res.json({
            message: "Operator Already Exists!",
            data: null,
          });
      }

      const newOperator: OperatorModel = {
        operatorId: operatorId,
        operatorPassword: operatorPassowrd,
        isRevoked: false,
      };

      await createUser(
        newOperator.operatorId,
        newOperator.operatorPassword,
        "admin"
      );

      await database
        .collection<OperatorModel>(CollectionListNames.OPERATOR)
        .insertOne(newOperator);

      return res.json({
        message: "Successfully created operator",
        data: newOperator,
      });
    } catch (error) {
      next(error);
    }
  }
);

// Revoke Operator
operatorRouter.post(
  "/revoke",
  verifyToken,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { operatorId } = req.body;

      const existingOperator = await database
        .collection<OperatorModel>(CollectionListNames.OPERATOR)
        .findOne({ operatorId: operatorId });

      if (existingOperator) {
        if (existingOperator.isRevoked)
          return res.json({
            message: "This operator is already revoked!",
            data: null,
          });
        else {
          await revokeUser(operatorId, "admin");

          const returnedDocument = await database
            .collection<OperatorModel>(CollectionListNames.OPERATOR)
            .findOneAndUpdate(
              { operatorId: operatorId },
              {
                $set: {
                  isRevoked: true,
                },
              },
              { returnDocument: "after" }
            );

          return res.json({
            message: "Successfully revoked operator",
            data: returnedDocument,
          });
        }
      } else {
        return res.json({
          message: "Operator not found!",
          data: null,
        });
      }
    } catch (error) {
      next(error);
    }
  }
);

export default operatorRouter;
