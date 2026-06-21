import { NextFunction, Request, Response, Router } from "express";
import { verifyToken } from "../middlewares/verifyToken";
import {
  createElectionBody,
  startElectionParams,
} from "../../shared/validators/electionValidator";
import {
  finishElection,
  getAllElections,
  initializeElection,
  isElectionExists,
  startElection,
} from "../networkConnection/electionContractFunctions/electionContractFunctions";

const electionRouter = Router();

// Get election list
electionRouter.get(
  "/all-election",
  verifyToken,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const electionResponseObjectArray = await getAllElections();

      return res.status(200).json({
        message: "Successfully get election list",
        electionList: electionResponseObjectArray,
      });
    } catch (error) {
      next(error);
    }
  }
);

// Create an Election
electionRouter.post(
  "/create",
  verifyToken,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { electionName } = createElectionBody.parse(req.body);
      const exists = await isElectionExists(electionName);
      if (exists)
        return res.status(409).json({
          message: "Election name exists",
        });
      const electionId = crypto.randomUUID(); // creating unique ID
      const response = await initializeElection(electionId, electionName);

      return res.status(200).json({
        message: response.message,
        election: response.data,
      });
    } catch (error) {
      next(error);
    }
  }
);

electionRouter.get(
  "/start-election/:electionId",
  verifyToken,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { electionId } = startElectionParams.parse(req.params);

      const response = await startElection(electionId);
      return res.status(200).json({
        message: response.message,
        election: response.data,
      });
    } catch (error) {
      next(error);
    }
  }
);

electionRouter.get(
  "/finish-election/:electionId",
  verifyToken,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { electionId } = startElectionParams.parse(req.params);

      const response = await finishElection(electionId);
      return res.status(200).json({
        message: response.message,
        election: response.data,
      });
    } catch (error) {
      next(error);
    }
  }
);

export default electionRouter;
