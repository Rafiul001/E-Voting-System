import { NextFunction, Request, Response, Router } from "express";
import { verifyToken } from "../middlewares/verifyToken";
import {
  getPermit,
  IssuePermit,
  SpendPermit,
} from "../networkConnection/voterPermitContractFunctions/voterPermitContractFuntions";

const permitRouter = Router();

// Operator can issue permit
permitRouter.post(
  "/issue-permit",
  verifyToken,
  async (req: Request, res: Response, next: NextFunction) => {
    const { permitKey, voterId, operatorId, electionId } = req.body;
    try {
      const responseFromContractFunction = await IssuePermit(
        permitKey,
        voterId,
        operatorId,
        electionId
      );

      return res.json(responseFromContractFunction);
    } catch (error) {
      next(error);
    }
  }
);

// Machine can spend permit
permitRouter.post(
  "/spend-permit",
  verifyToken,
  async (req: Request, res: Response, next: NextFunction) => {
    const { permitKey, electionId, machineId } = req.body;
    try {
      const responseFromContractFunction = await SpendPermit(
        permitKey,
        electionId,
        machineId
      );

      return res.json(responseFromContractFunction);
    } catch (error) {
      next(error);
    }
  }
);

// Operator can get permit
permitRouter.post(
  "/get-permit",
  verifyToken,
  async (req: Request, res: Response, next: NextFunction) => {
    const { voterId, electionId, operatorId } = req.body;
    try {
      const responseFromContractFunction = await getPermit(
        voterId,
        electionId,
        operatorId
      );

      return res.json(responseFromContractFunction);
    } catch (error) {
      next(error);
    }
  }
);

export default permitRouter;
