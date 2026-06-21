import { getElectionContractAndGateway } from "../networkConnection";

type TElectionRecord = {
  electionId: string;
  electionName: string;
  status: string;
  updatedAt: string;
};

export async function getAllElections(userId: string) {
  const electionGateWayWithContract =
    await getElectionContractAndGateway(userId);
  try {
    const response =
      await electionGateWayWithContract.contractElectionCC.submitTransaction(
        "getAllElection"
      );
    const electionResponseObject = JSON.parse(response.toString("utf-8")) as {
      message: string;
      data: TElectionRecord[] | null;
    };
    return electionResponseObject;
  } catch (error) {
    console.error(`Error in setup: ${error}`);
  }
}
