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

export async function CastVote(
  candidateId: string,
  electionId: string,
  constituencyNumber: string,
  constituencyName: string,
  permitKey: string,
  machineId: string
) {
  const voteTallyGateWayWithContract =
    await getVoteTallyContractAndGateway(machineId);
  try {
    const response =
      await voteTallyGateWayWithContract.contractVoteTallyCC.submitTransaction(
        "CastVote",
        candidateId,
        electionId,
        constituencyNumber,
        constituencyName,
        permitKey
      );
    const tallyObjectJSONResponse = JSON.parse(response.toString("utf-8")) as {
      message: string;
      data: TTallyRecord | null;
    };
    return tallyObjectJSONResponse;
  } catch (error) {
    console.error(`Error in setup: ${error}`);
  } finally {
    voteTallyGateWayWithContract.gatewayDistrictCommission.disconnect();
  }
}

export async function GetTally(
  electionId: string,
  constituencyNumber: string,
  constituencyName: string,
  candidateId: string,
  adminId: string
) {
  const voteTallyGateWayWithContract =
    await getVoteTallyContractAndGateway(adminId);
  try {
    const response =
      await voteTallyGateWayWithContract.contractVoteTallyCC.submitTransaction(
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
  } finally {
    voteTallyGateWayWithContract.gatewayDistrictCommission.disconnect();
  }
}

export async function GetConstituencyTallies(
  electionId: string,
  constituencyNumber: string,
  constituencyName: string,
  adminId: string
) {
  const voteTallyGateWayWithContract =
    await getVoteTallyContractAndGateway(adminId);
  try {
    const response =
      await voteTallyGateWayWithContract.contractVoteTallyCC.submitTransaction(
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
  } finally {
    voteTallyGateWayWithContract.gatewayDistrictCommission.disconnect();
  }
}

export async function GetElectionTalliesCount(
  electionId: string,
  adminId: string
) {
  const voteTallyGateWayWithContract =
    await getVoteTallyContractAndGateway(adminId);
  try {
    const response =
      await voteTallyGateWayWithContract.contractVoteTallyCC.submitTransaction(
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
  } finally {
    voteTallyGateWayWithContract.gatewayDistrictCommission.disconnect();
  }
}
