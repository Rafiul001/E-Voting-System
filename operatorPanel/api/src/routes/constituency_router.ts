import { NextFunction, Request, Response, Router } from "express";
import { verifyToken } from "../middlewares/verifyToken";
import { database } from "../mongodb_connection/connection";
import { CollectionListNames } from "../config/config";
import { ConstituencyModel } from "../models/constituencyModel";

const constituencyRouter = Router();

// Get all constituency list
constituencyRouter.get(
  "/get-all",
  verifyToken,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const constituencyList = await database
        .collection<ConstituencyModel>(CollectionListNames.CONSTITUENCY)
        .find()
        .toArray();

      return res.status(200).json({
        message: "Successfully get Constituency List",
        data: constituencyList,
      });
    } catch (error) {
      next(error);
    }
  }
);

export default constituencyRouter;
