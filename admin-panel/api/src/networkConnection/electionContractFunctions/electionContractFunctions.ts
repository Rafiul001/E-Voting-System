import { getElectionContractAndGateway } from "../networkConnection";

type TElectionRecord = {
  electionId: string;
  electionName: string;
  status: string;
  updatedAt: string;
};

export async function getAllElections() {
  const electionContract = await getElectionContractAndGateway();
  try {
    const response = await electionContract.submitTransaction("getAllElection");
    const electionResponseObjectArray = JSON.parse(response.toString("utf-8"))
      .data as TElectionRecord[];
    return electionResponseObjectArray;
  } catch (error) {
    console.error(`Error in setup: ${error}`);
  }
}

export async function getElectionById(electionId: string) {
  const electionContract = await getElectionContractAndGateway();
  try {
    const response = await electionContract.submitTransaction(
      "getElectionById",
      electionId
    );
    const electionResponseObject = JSON.parse(response.toString("utf-8"));
    return electionResponseObject;
  } catch (error) {
    console.error(`Error in setup: ${error}`);
  }
}

export async function initializeElection(
  electionId: string,
  electionName: string
) {
  const electionContract = await getElectionContractAndGateway();
  try {
    const response = await electionContract.submitTransaction(
      "Initialize",
      electionId,
      electionName
    );
    const electionResponseObject = JSON.parse(response.toString("utf-8"));
    return electionResponseObject;
  } catch (error) {
    console.error(`Error in setup: ${error}`);
  }
}

export async function startElection(electionId: string) {
  const electionContract = await getElectionContractAndGateway();
  try {
    const response = await electionContract.submitTransaction(
      "StartElection",
      electionId
    );
    const electionResponseObject = JSON.parse(response.toString("utf-8"));
    return electionResponseObject;
  } catch (error) {
    console.error(`Error in setup: ${error}`);
  }
}

export async function finishElection(electionId: string) {
  const electionContract = await getElectionContractAndGateway();
  try {
    const response = await electionContract.submitTransaction(
      "FinishElection",
      electionId
    );
    const electionResponseObject = JSON.parse(response.toString("utf-8"));
    return electionResponseObject;
  } catch (error) {
    console.error(`Error in setup: ${error}`);
  }
}

export async function isElectionExists(electionName: string) {
  const electionContract = await getElectionContractAndGateway();
  try {
    const response = await electionContract.submitTransaction(
      "electionExists",
      electionName
    );
    const isExist = JSON.parse(response.toString("utf-8")) as boolean;
    return isExist;
  } catch (error) {
    console.error(`Error in setup: ${error}`);
  }
}
