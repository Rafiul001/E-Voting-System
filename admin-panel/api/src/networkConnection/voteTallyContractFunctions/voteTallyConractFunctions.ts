import { getVoteTallyContractAndGateway } from "../networkConnection";

type TTallyRecord = {
  tallyKey: string;
  candidateId: string;
  electionId: string;
  constituencyNumber: number;
  constituencyName: string;
  voteCount: number;
  createdAt: string;
  updatedAt: string;
};

export async function GetTally(
  electionId: string,
  constituencyNumber: string,
  constituencyName: string,
  candidateId: string
) {
  const voteTallyGateWayWithContract = await getVoteTallyContractAndGateway();
  try {
    const response = await voteTallyGateWayWithContract.submitTransaction(
      "GetTally",
      electionId,
      constituencyNumber,
      constituencyName,
      candidateId
    );
    const tallyObjectJSONResponse = JSON.parse(response.toString("utf-8")) as {
      message: string;
      data: TTallyRecord | null;
    };
    return tallyObjectJSONResponse;
  } catch (error) {
    console.error(`Error in setup: ${error}`);
  }
}

export async function GetConstituencyTallies(
  electionId: string,
  constituencyNumber: string,
  constituencyName: string
) {
  const voteTallyGateWayWithContract = await getVoteTallyContractAndGateway();
  try {
    const response = await voteTallyGateWayWithContract.submitTransaction(
      "GetConstituencyTallies",
      electionId,
      constituencyNumber,
      constituencyName
    );
    const tallyObjectJSONResponse = JSON.parse(response.toString("utf-8")) as {
      message: string;
      data: TTallyRecord[] | null;
    };
    return tallyObjectJSONResponse;
  } catch (error) {
    console.error(`Error in setup: ${error}`);
  }
}

export async function GetElectionTalliesCount(electionId: string) {
  const voteTallyGateWayWithContract = await getVoteTallyContractAndGateway();
  try {
    const response = await voteTallyGateWayWithContract.submitTransaction(
      "GetElectionTallies",
      electionId
    );
    const tallyObjectJSONResponse = JSON.parse(response.toString("utf-8")) as {
      message: string;
      data: number | null;
    };
    return tallyObjectJSONResponse;
  } catch (error) {
    console.error(`Error in setup: ${error}`);
  }
}
