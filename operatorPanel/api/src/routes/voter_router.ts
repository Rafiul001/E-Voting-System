import { NextFunction, Request, Response, Router } from "express";
import { verifyToken } from "../middlewares/verifyToken";
import { database } from "../mongodb_connection/connection";
import { VoterModel } from "../models/voterModel";
import { CollectionListNames } from "../config/config";

const voterRouter = Router();

// Verify Voter By ID:
voterRouter.get(
  "/get/:voterId",
  verifyToken,
  async (req: Request, res: Response, next: NextFunction) => {
    const { voterId } = req.params;
    try {
      const response = await database
        .collection<VoterModel>(CollectionListNames.VOTER)
        .findOne({
          voterId: voterId,
        });

      if (!response) {
        return res.status(404).json({
          message: "Voter not found!",
          data: null,
        });
      }

      return res.json({
        message: "Voter verified",
        data: {
          isVerified: true,
          voterName: response.voterName,
          voterId: response.voterId,
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

export default voterRouter;
