import { getVoterPermitContractAndGateway } from "../networkConnection";

type TPermitRecord = {
  permitKey: string;
  electionId: string;
  voterId: string;
  operatorId: string;
  issuedAt?: string;
  status?: string;
  spentAt?: string;
};

export async function IssuePermit(
  permitKey: string,
  voterId: string,
  operatorId: string,
  electionId: string
) {
  const voterPermitGateWayWithContract =
    await getVoterPermitContractAndGateway(operatorId);
  try {
    const response =
      await voterPermitGateWayWithContract.contractVoterPermitCC.submitTransaction(
        "IssuePermit",
        permitKey,
        voterId,
        operatorId,
        electionId
      );
    const voterPermitResponseObject = JSON.parse(
      response.toString("utf-8")
    ) as { message: string; data: TPermitRecord | null };
    return voterPermitResponseObject;
  } catch (error) {
    console.error(`Error in setup: ${error}`);
  } finally {
    voterPermitGateWayWithContract.gatewayDistrictCommission.disconnect();
  }
}

export async function SpendPermit(
  permitKey: string,
  electionId: string,
  machineId: string
) {
  const voterPermitGateWayWithContract =
    await getVoterPermitContractAndGateway(machineId);
  try {
    const response =
      await voterPermitGateWayWithContract.contractVoterPermitCC.submitTransaction(
        "SpendPermit",
        permitKey,
        electionId
      );
    const voterPermitResponseObject = JSON.parse(
      response.toString("utf-8")
    ) as { message: string; data: TPermitRecord | null };
    return voterPermitResponseObject;
  } catch (error) {
    console.error(`Error in setup: ${error}`);
  } finally {
    voterPermitGateWayWithContract.gatewayDistrictCommission.disconnect();
  }
}

export async function getPermit(
  voterId: string,
  electionId: string,
  operatorId: string
) {
  const voterPermitGateWayWithContract =
    await getVoterPermitContractAndGateway(operatorId);
  try {
    const response =
      await voterPermitGateWayWithContract.contractVoterPermitCC.submitTransaction(
        "getPermit",
        voterId,
        electionId
      );
    const candidateResponseObject = JSON.parse(response.toString("utf-8")) as {
      message: string;
      data: TPermitRecord | null;
    };
    return candidateResponseObject;
  } catch (error) {
    console.error(`Error in setup: ${error}`);
  } finally {
    voterPermitGateWayWithContract.gatewayDistrictCommission.disconnect();
  }
}
