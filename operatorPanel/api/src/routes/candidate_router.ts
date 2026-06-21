import { NextFunction, Request, Response, Router } from "express";
import { verifyToken } from "../middlewares/verifyToken";
import {
  getPermit,
  IssuePermit,
  SpendPermit,
} from "../networkConnection/voterPermitContractFunctions/voterPermitContractFuntions";
import { getAllCandidatesByConstituencyNumber } from "../networkConnection/candidateContractFunctions/candidateContractFuntions";

const candidateRouter = Router();

// Get all candidates by constituency number and name
candidateRouter.get(
  "/get-all/:constituencyNumber/:constituencyName/:machineId",
  verifyToken,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { constituencyNumber, constituencyName, machineId } = req.params;

      const responseFromContractFunction =
        await getAllCandidatesByConstituencyNumber(
          constituencyName,
          Number(constituencyNumber),
          machineId
        );

      return res.json(responseFromContractFunction);
    } catch (error) {
      next(error);
    }
  }
);

export default candidateRouter;
