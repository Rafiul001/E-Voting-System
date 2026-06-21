import { NextFunction, Request, Response, Router } from "express";
import { verifyToken } from "../middlewares/verifyToken";
import { database } from "../mongodb_connection/connection";
import { VoterModel } from "../models/voterModel";
import { CollectionListNames } from "../config/config";
import { ObjectId } from "mongodb";

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
          voterId: response.voterId,
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

// Get all voters
voterRouter.post(
  "/get-all",
  verifyToken,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {
        constituencyName,
        constituencyNumber,
        districtName,
        divisionName,
        upazila,
        cityCorporation,
      } = req.body;

      const query: any = {};

      // Always check the higher level fields inside constituency
      if (divisionName) query["constituency.divisionName"] = divisionName;
      if (districtName) query["constituency.districtName"] = districtName;
      if (constituencyName)
        query["constituency.constituencyName"] = constituencyName;
      if (constituencyNumber)
        query["constituency.constituencyNumber"] = constituencyNumber;

      // Check for upazila-based voter
      if (
        upazila?.upazilaName &&
        upazila?.unionName &&
        upazila?.wardNumber !== undefined
      ) {
        query["constituency.upazila.upazilaName"] = upazila.upazilaName;
        query["constituency.upazila.unionName"] = upazila.unionName;
        query["constituency.upazila.wardNumber"] = upazila.wardNumber;
      }

      // Check for city corporation-based voter
      if (
        cityCorporation?.cityCorporationName &&
        cityCorporation?.wardNumber !== undefined
      ) {
        query["constituency.cityCorporation.cityCorporationName"] =
          cityCorporation.cityCorporationName;
        query["constituency.cityCorporation.wardNumber"] =
          cityCorporation.wardNumber;
      }
      const voterList = await database
        .collection(CollectionListNames.VOTER)
        .find(query)
        .toArray();

      return res.status(200).json({
        message: "Successfully fetched voters",
        voterList: voterList,
      });
    } catch (error) {
      next(error);
    }
  }
);

// Create Voter
voterRouter.post(
  "/create",
  verifyToken,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { voterId, voterName, dateOfBirth, constituency } = req.body;

      const exist = await database
        .collection<VoterModel>(CollectionListNames.VOTER)
        .findOne({
          voterId: voterId,
        });

      if (exist)
        return res.status(409).json({
          message: "VoterId already exists",
        });

      let constituencyNew: any;

      if (constituency.upazila) {
        constituencyNew = {
          divisionName: constituency.divisionName,
          districtName: constituency.districtName,
          constituencyNumber: constituency.constituencyNumber,
          constituencyName: constituency.constituencyName,
          homeAddress: constituency.homeAddress,
          upazila: constituency.upazila,
        };
      } else if (constituency.cityCorporation) {
        constituencyNew = {
          divisionName: constituency.divisionName,
          districtName: constituency.districtName,
          constituencyNumber: constituency.constituencyNumber,
          constituencyName: constituency.constituencyName,
          homeAddress: constituency.homeAddress,
          cityCorporation: constituency.cityCorporation,
        };
      } else {
        return res.status(409).json({
          message: "Constituency must contain upazila or city corporation",
        });
      }

      const newVoter = new VoterModel(
        voterId,
        voterName,
        dateOfBirth,
        constituencyNew
      );

      await database
        .collection<VoterModel>(CollectionListNames.VOTER)
        .insertOne(newVoter);

      return res.status(200).json({
        message: "Successfully created a new voter",
      });
    } catch (error) {
      return next(error);
    }
  }
);

// Delete a voter
voterRouter.delete(
  "/delete/:voterObjectId",
  verifyToken,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { voterObjectId } = req.params;

      const data = await database
        .collection<VoterModel>(CollectionListNames.VOTER)
        .findOneAndDelete({
          _id: new ObjectId(voterObjectId),
        });

      if (!data)
        return res.status(404).json({
          message: "Voter does not exists",
        });

      return res.status(200).json({
        message: "Successfully deleted voter",
      });
    } catch (error) {
      next(error);
    }
  }
);

// Update a voter
voterRouter.put(
  "/update/:voterObjectId",
  // verifyToken,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { voterObjectId } = req.params;

      const { voterId, voterName, dateOfBirth, homeAddress, constituency } =
        req.body;

      const updateFields: any = {};

      // top-level fields
      if (voterId) updateFields.voterId = voterId;
      if (voterName) updateFields.voterName = voterName;
      if (dateOfBirth) updateFields.dateOfBirth = dateOfBirth;

      // nested constituency updates
      if (homeAddress) updateFields["constituency.homeAddress"] = homeAddress;
      if (constituency) {
        updateFields.constituency = constituency;
      }

      const data = await database
        .collection<VoterModel>(CollectionListNames.VOTER)
        .findOneAndReplace({ _id: new ObjectId(voterObjectId) }, updateFields, {
          returnDocument: "after",
        });

      if (!data) {
        return res.status(404).json({ message: "Voter not found" });
      }

      return res.status(200).json({
        message: "Successfully updated",
      });
    } catch (error) {
      next(error);
    }
  }
);

export default voterRouter;
