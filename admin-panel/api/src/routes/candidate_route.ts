import { NextFunction, Request, Response, Router } from "express";
import { verifyToken } from "../middlewares/verifyToken";
import {
  addConstituency,
  createCandidate,
  deleteCandidate,
  getAllCandidatesByConstituencyNumber,
  getAllCandidatesByElectionId,
  removeConstituency,
} from "../networkConnection/candidateContractFunctions/candidateContractFunctions";

const candidateRouter = Router();

// Get all candidates by election ID
candidateRouter.get(
  "/get-all/:electionId",
  verifyToken,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { electionId } = req.params;

      const candidateList = await getAllCandidatesByElectionId(electionId);

      return res.json({
        message: "Successfully get all candidate",
        candidateList: candidateList,
      });
    } catch (error) {
      next(error);
    }
  }
);

// Get all candidates by constituency number and name
candidateRouter.get(
  "/get-all/:constituencyNumber/:constituencyName",
  verifyToken,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { constituencyNumber, constituencyName } = req.params;

      const candidateList = await getAllCandidatesByConstituencyNumber(
        constituencyName,
        Number(constituencyNumber)
      );

      return res.json({
        message: "Successfully get all candidate",
        candidateList: candidateList,
      });
    } catch (error) {
      next(error);
    }
  }
);

// Create new candidate
candidateRouter.post(
  "/create",
  verifyToken,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {
        candidateName,
        voterId,
        electionId,
        constituencyNumber,
        constituencyName,
        affiliation,
        partyName,
      } = req.body;

      const candidateId = crypto.randomUUID();

      const response = await createCandidate(
        candidateId,
        candidateName,
        voterId,
        electionId,
        constituencyNumber,
        constituencyName,
        affiliation,
        partyName
      );

      console.log(response.message)

      return res.status(200).json({
        message: response.message,
        candidate: response.data,
      });
    } catch (error) {
      next(error);
    }
  }
);

// Add constituency
candidateRouter.put(
  "/:electionId/:candidateId/addConstituency",
  verifyToken,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { electionId, candidateId } = req.params;
      const { constituencyNumber, constituencyName } = req.body;

      const response = await addConstituency(
        candidateId,
        electionId,
        constituencyNumber,
        constituencyName
      );

      return res.status(200).json({
        message: response.message,
        candidate: response.data,
      });
    } catch (error) {
      next(error);
    }
  }
);

// Remove constituency
candidateRouter.put(
  "/:electionId/:candidateId/removeConstituency",
  verifyToken,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { electionId, candidateId } = req.params;
      const { constituencyNumber, constituencyName } = req.body;

      const response = await removeConstituency(
        candidateId,
        electionId,
        constituencyNumber,
        constituencyName
      );

      return res.status(200).json({
        message: response.message,
        candidate: response.data,
      });
    } catch (error) {
      next(error);
    }
  }
);

// Delete Candidate
candidateRouter.delete(
  "/delete/:candidateId/:electionId",
  verifyToken,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { candidateId, electionId } = req.params;

      const response = await deleteCandidate(candidateId, electionId);

      return res.status(200).json({
        message: response.message,
        candidate: response.data,
      });
    } catch (error) {
      next(error);
    }
  }
);

export default candidateRouter;
