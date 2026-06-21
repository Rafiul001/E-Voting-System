import { getCandidateContractAndGateway } from "../networkConnection";

type TCandidateConstituency = {
  constituencyName: string;
  constituencyNumber: number;
};

type TCandidateAffiliationType = {
  affiliation: string;
  partyName: string | null;
};

type TCandidateRecord = {
  candidateId: string;
  candidateName: string;
  voterId: string;
  electionId: string;
  constituency: TCandidateConstituency[];
  affiliationType: TCandidateAffiliationType;
  createdAt: string;
  updatedAt: string;
};

export async function getAllCandidatesByElectionId(
  electionId: string,
  userId: string
) {
  const candidateGateWayWithContract =
    await getCandidateContractAndGateway(userId);
  try {
    const response =
      await candidateGateWayWithContract.contractCandidateCC.submitTransaction(
        "getAllCandidatesByElectionId",
        electionId
      );
    const candidateResponseObject = JSON.parse(response.toString("utf-8")) as {
      message: string;
      data: TCandidateRecord[] | null;
    };
    return candidateResponseObject;
  } catch (error) {
    console.error(`Error in setup: ${error}`);
  } finally {
    candidateGateWayWithContract.gatewayDistrictCommission.disconnect();
  }
}

export async function getAllCandidatesByConstituencyNumber(
  constituencyName: string,
  constituencyNumber: number,
  userId: string
) {
  const candidateGateWayWithContract =
    await getCandidateContractAndGateway(userId);
  try {
    const response =
      await candidateGateWayWithContract.contractCandidateCC.submitTransaction(
        "getAllCandidatesByConstituencyNumber",
        String(constituencyNumber),
        constituencyName
      );
    const candidateResponseObject = JSON.parse(response.toString("utf-8")) as {
      message: string;
      data: TCandidateRecord[] | null;
    };
    return candidateResponseObject;
  } catch (error) {
    console.error(`Error in setup: ${error}`);
  } finally {
    candidateGateWayWithContract.gatewayDistrictCommission.disconnect();
  }
}
