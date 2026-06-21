import { NextFunction, Request, Response, Router } from "express";
import { verifyToken } from "../middlewares/verifyToken";
import {
  GetConstituencyTallies,
  GetElectionTalliesCount,
  GetTally,
} from "../networkConnection/voteTallyContractFunctions/voteTallyConractFunctions";

const voteRouter = Router();

// Admin can get tally
voteRouter.post(
  "/get-tally",
  verifyToken,
  async (req: Request, res: Response, next: NextFunction) => {
    const { electionId, constituencyNumber, constituencyName, candidateId } =
      req.body;
    try {
      const responseFromContractFunction = await GetTally(
        electionId,
        constituencyNumber,
        constituencyName,
        candidateId
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
    const { electionId, constituencyNumber, constituencyName } = req.body;
    try {
      const responseFromContractFunction = await GetConstituencyTallies(
        electionId,
        constituencyNumber,
        constituencyName
      );

      console.log(responseFromContractFunction);
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
    const { electionId } = req.body;
    try {
      const responseFromContractFunction =
        await GetElectionTalliesCount(electionId);

      return res.json(responseFromContractFunction);
    } catch (error) {
      next(error);
    }
  }
);

export default voteRouter;
