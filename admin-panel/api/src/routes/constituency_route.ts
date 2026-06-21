import { NextFunction, Request, Response, Router } from "express";
import { verifyToken } from "../middlewares/verifyToken";
import { database } from "../mongodb_connection/connection";
import { CollectionListNames } from "../config/config";
import { ConstituencyModel } from "../models/constituencyModel";
import {
  createNewDivisionBody,
  deleteConstituencyParams,
  updateConstituencyPartBody,
  updateConstituencyPartParams,
} from "../../shared/validators/constituencyValidator";
import { ObjectId } from "mongodb";
import { VoterModel } from "../models/voterModel";

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
        constituencyList: constituencyList,
      });
    } catch (error) {
      next(error);
    }
  }
);

// Create a new division
constituencyRouter.post(
  "/create",
  verifyToken,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { divisionName } = createNewDivisionBody.parse(req.body);

      const data = await database
        .collection<ConstituencyModel>(CollectionListNames.CONSTITUENCY)
        .findOne({
          divisionName: divisionName.toLowerCase(),
        });

      if (data)
        return res.status(409).json({
          message: "This division is already exists",
        });

      const constituency = new ConstituencyModel(divisionName, []);

      await database
        .collection<ConstituencyModel>(CollectionListNames.CONSTITUENCY)
        .insertOne(constituency);

      return res.status(200).json({
        message: "Successfully created a new division",
        constituency: constituency,
      });
    } catch (error) {
      next(error);
    }
  }
);

// update a part of division
constituencyRouter.put(
  "/add/:constituencyObjectId",
  verifyToken,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { constituencyObjectId } = updateConstituencyPartParams.parse(
        req.params
      );
      const { divisionName, districts } = updateConstituencyPartBody.parse(
        req.body
      );

      // Build update object conditionally
      const updateFields: any = {};
      if (divisionName) updateFields.divisionName = divisionName;
      if (districts) updateFields.districts = districts;

      const updated = await database
        .collection<ConstituencyModel>(CollectionListNames.CONSTITUENCY)
        .findOneAndUpdate(
          { _id: new ObjectId(constituencyObjectId) },
          { $set: updateFields },
          { returnDocument: "after" }
        );

      if (!updated) {
        return res.status(404).json({ message: "Division not found" });
      }

      return res.status(200).json({
        message: "Division updated successfully",
        constituency: updated,
      });
    } catch (error) {
      next(error);
    }
  }
);

// Delete the division
constituencyRouter.delete(
  "/delete/:constituencyObjectId",
  verifyToken,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { constituencyObjectId } = deleteConstituencyParams.parse(
        req.params
      );

      const constituencyExists = await database
        .collection<ConstituencyModel>(CollectionListNames.CONSTITUENCY)
        .findOne({
          _id: new ObjectId(constituencyObjectId),
        });

      if (!constituencyExists) {
        return res.status(404).json({ message: "Division not found" });
      }

      const existsVoter = await database
        .collection<VoterModel>(CollectionListNames.VOTER)
        .findOne({
          "constituency.divisionName":
            constituencyExists.divisionName.toLowerCase(),
        });

      if (existsVoter)
        return res.status(409).json({
          message:
            "Can not delete this division. Please update the voters list first with this division",
        });

      const deletedItem = await database
        .collection<ConstituencyModel>(CollectionListNames.CONSTITUENCY)
        .findOneAndDelete({ _id: new ObjectId(constituencyObjectId) });

      return res.status(200).json({
        message: "Division deleted successfully",
        constituency: deletedItem,
      });
    } catch (error) {
      next(error);
    }
  }
);

export default constituencyRouter;
