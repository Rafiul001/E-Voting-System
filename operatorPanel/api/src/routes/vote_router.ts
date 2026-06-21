import { NextFunction, Request, Response, Router } from "express";
import { verifyToken } from "../middlewares/verifyToken";
import {
  CastVote,
  GetConstituencyTallies,
  GetElectionTalliesCount,
  GetTally,
} from "../networkConnection/voteTallyContractFunctions/voteTallyContractFunctions";

const voteRouter = Router();

// Machine can cast vote
voteRouter.post(
  "/cast-vote",
  verifyToken,
  async (req: Request, res: Response, next: NextFunction) => {
    const {
      candidateId,
      electionId,
      constituencyNumber,
      constituencyName,
      permitKey,
      machineId,
    } = req.body;
    try {
      const responseFromContractFunction = await CastVote(
        candidateId,
        electionId,
        String(constituencyNumber),
        constituencyName,
        permitKey,
        machineId
      );

      return res.json(responseFromContractFunction);
    } catch (error) {
      next(error);
    }
  }
);

// Admin can get tally
voteRouter.post(
  "/get-tally",
  verifyToken,
  async (req: Request, res: Response, next: NextFunction) => {
    const {
      electionId,
      constituencyNumber,
      constituencyName,
      candidateId,
      adminId,
    } = req.body;
    try {
      const responseFromContractFunction = await GetTally(
        electionId,
        constituencyNumber,
        constituencyName,
        candidateId,
        adminId
      );

      return res.json(responseFromContractFunction);
    } catch (error) {
      next(error);
    }
  }
);

// Admin can get constituency tallies
voteRouter.post(
  "/get-constituency-tallies",
  verifyToken,
  async (req: Request, res: Response, next: NextFunction) => {
    const { electionId, constituencyNumber, constituencyName, adminId } =
      req.body;
    try {
      const responseFromContractFunction = await GetConstituencyTallies(
        electionId,
        constituencyNumber,
        constituencyName,
        adminId
      );

      return res.json(responseFromContractFunction);
    } catch (error) {
      next(error);
    }
  }
);

// Admin can get constituency tallies
voteRouter.post(
  "/get-constituency-tallies",
  verifyToken,
  async (req: Request, res: Response, next: NextFunction) => {
    const { electionId, adminId } = req.body;
    try {
      const responseFromContractFunction = await GetElectionTalliesCount(
        electionId,
        adminId
      );

      return res.json(responseFromContractFunction);
    } catch (error) {
      next(error);
    }
  }
);

export default voteRouter;
