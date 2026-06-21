import { NextFunction, Request, Response, Router } from "express";
import { verifyToken } from "../middlewares/verifyToken";
import { getAllElections } from "../networkConnection/electionContractFunctions/electionContractFuntions";

const electionRouter = Router();

// Get election list
electionRouter.get(
  "/all-election/:operatorId",
  verifyToken,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { operatorId } = req.params;
      const electionResponseObject = await getAllElections(operatorId);
      return res.json(electionResponseObject);
    } catch (error) {
      next(error);
    }
  }
);

export default electionRouter;
