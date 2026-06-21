import { NextFunction, Request, Response, Router } from "express";
import { MachineModel } from "../models/machineModel";
import { database } from "../mongodb_connection/connection";
import { CollectionListNames } from "../config/config";
import { createUser, revokeUser } from "../networkConnection/networkConnection";
import { verifyToken } from "../middlewares/verifyToken";

const machineRouter = Router();

// Get All Machines
machineRouter.get(
  "/get-all",
  verifyToken,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const machineArray = await database
        .collection<MachineModel>(CollectionListNames.MACHINE)
        .find()
        .toArray();

      return res.json({
        message: "Successfully get all the machines",
        data: machineArray,
      });
    } catch (error) {
      next(error);
    }
  }
);

// Create Machine
machineRouter.post(
  "/create",
  verifyToken,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {
        machineId,
        machinePassowrd,
        divisionName,
        districtName,
        constituencyNumber,
        constituencyName,
      } = req.body;

      const existingMachine = await database
        .collection<MachineModel>(CollectionListNames.MACHINE)
        .findOne({ machineId: machineId });

      if (existingMachine) {
        if (existingMachine.isRevoked)
          return res.json({
            message: "This machine is revoked!",
            data: null,
          });
        else
          return res.json({
            message: "Machine is Already Exists!",
            data: null,
          });
      }

      const newMachine: MachineModel = {
        machineId: machineId,
        machinePassword: machinePassowrd,
        divisionName: divisionName,
        districtName: districtName,
        constituencyNumber: constituencyNumber,
        constituencyName: constituencyName,
        isRevoked: false,
      };

      await createUser(
        newMachine.machineId,
        newMachine.machinePassword,
        "admin"
      );

      await database
        .collection<MachineModel>(CollectionListNames.MACHINE)
        .insertOne(newMachine);

      return res.json({
        message: "Successfully created machine!",
        data: newMachine,
      });
    } catch (error) {
      next(error);
    }
  }
);

// Revoke Machine
machineRouter.post(
  "/revoke",
  verifyToken,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { machineId } = req.body;

      const existingMachine = await database
        .collection<MachineModel>(CollectionListNames.MACHINE)
        .findOne({ machineId: machineId });

      if (existingMachine) {
        if (existingMachine.isRevoked)
          return res.json({
            message: "This machine is already revoked!",
            data: null,
          });
        else {
          await revokeUser(machineId, "admin");

          const returnedDocument = await database
            .collection<MachineModel>(CollectionListNames.MACHINE)
            .findOneAndUpdate(
              { machineId: machineId },
              {
                $set: {
                  isRevoked: true,
                },
              },
              { returnDocument: "after" }
            );

          return res.json({
            message: "Successfully revoked machine",
            data: returnedDocument,
          });
        }
      } else {
        return res.json({
          message: "Machine is not found!",
          data: null,
        });
      }
    } catch (error) {
      next(error);
    }
  }
);

export default machineRouter;
