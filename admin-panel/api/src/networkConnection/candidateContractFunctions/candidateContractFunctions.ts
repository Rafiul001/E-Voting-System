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

export async function getAllCandidatesByElectionId(electionId: string) {
  const candidateContract = await getCandidateContractAndGateway();
  try {
    const response = await candidateContract.submitTransaction(
      "getAllCandidatesByElectionId",
      electionId
    );
    const candidateResponseObjectArray = JSON.parse(response.toString("utf-8"))
      .data as TCandidateRecord[];
    return candidateResponseObjectArray;
  } catch (error) {
    console.error(`Error in setup: ${error}`);
  }
}

export async function getAllCandidatesByConstituencyNumber(
  constituencyName: string,
  constituencyNumber: number
) {
  const candidateContract = await getCandidateContractAndGateway();
  try {
    const response = await candidateContract.submitTransaction(
      "getAllCandidatesByConstituencyNumber",
      String(constituencyNumber),
      constituencyName
    );
    const candidateResponseObjectArray = JSON.parse(response.toString("utf-8"))
      .data as TCandidateRecord[];
    return candidateResponseObjectArray;
  } catch (error) {
    console.error(`Error in setup: ${error}`);
  }
}

export async function createCandidate(
  candidateId: string,
  candidateName: string,
  voterId: string,
  electionId: string,
  constituencyNumber: number,
  constituencyName: string,
  affiliation: string,
  partyName: string
) {
  const candidateContract = await getCandidateContractAndGateway();
  try {
    const response = await candidateContract.submitTransaction(
      "CreateCandidate",
      candidateId,
      candidateName,
      voterId,
      electionId,
      String(constituencyNumber),
      constituencyName,
      affiliation,
      partyName
    );
    const candidateResponseObject = JSON.parse(response.toString("utf-8"));
    return candidateResponseObject;
  } catch (error) {
    console.error(`Error in setup: ${error}`);
  }
}

export async function addConstituency(
  candidateId: string,
  electionId: string,
  constituencyNumber: number,
  constituencyName: string
) {
  const candidateContract = await getCandidateContractAndGateway();
  try {
    const response = await candidateContract.submitTransaction(
      "addConstituency",
      candidateId,
      electionId,
      String(constituencyNumber),
      constituencyName
    );
    const candidateResponseObject = JSON.parse(response.toString("utf-8"));
    return candidateResponseObject;
  } catch (error) {
    console.error(`Error in setup: ${error}`);
  }
}

export async function removeConstituency(
  candidateId: string,
  electionId: string,
  constituencyNumber: number,
  constituencyName: string
) {
  const candidateContract = await getCandidateContractAndGateway();
  try {
    const response = await candidateContract.submitTransaction(
      "RemoveConstituency",
      candidateId,
      electionId,
      String(constituencyNumber),
      constituencyName
    );
    const candidateResponseObject = JSON.parse(response.toString("utf-8"));
    return candidateResponseObject;
  } catch (error) {
    console.error(`Error in setup: ${error}`);
  }
}

export async function deleteCandidate(candidateId: string, electionId: string) {
  const candidateContract = await getCandidateContractAndGateway();
  try {
    const response = await candidateContract.submitTransaction(
      "DeleteCandidate",
      candidateId,
      electionId
    );
    const candidateResponseObject = JSON.parse(response.toString("utf-8"));
    return candidateResponseObject;
  } catch (error) {
    console.error(`Error in setup: ${error}`);
  }
}
