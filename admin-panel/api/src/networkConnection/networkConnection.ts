import { Contract, Gateway, Wallet, Wallets } from "fabric-network";
import FabricCAServices from "fabric-ca-client";
import path from "path";
import {
  buildCAClient,
  enrollAdmin,
  enrollNewAdmin,
  registerAndEnrollUser,
} from "../tools/caUtil";
import { buildCCPOrg, buildWallet } from "../tools/appUtil";

const channelName = "votingchannel";
const electionCC = "electioncc";
const candidateCC = "candidatecc";
const voteTallyCC = "votetallycc";

const electionCommissionOrg = "ElectionCommissionMSP";
// const adminId = "admin";

// build an in memory object with the network configuration (also known as a connection profile)
const ccpElectionCommissionOrg = buildCCPOrg();

// setup the wallet to cache the credentials of the application user, on the app server locally
const walletPathElectionCommission = path.join(
  __dirname,
  "wallet",
  "electioncommission"
);

// build an instance of the fabric ca services client based on
// the information in the network configuration
const caElectionCommissionClient = buildCAClient(
  FabricCAServices,
  ccpElectionCommissionOrg,
  "ca.electionCommission.example.com"
);

// Create a new gateway for connecting to Org's peer node.
export const gatewayElectionCommission = new Gateway();

export async function initiallyEnrollAdminAndConnectGateway(
  adminUserId: string,
  adminUserPassword: string
) {
  console.log(
    "\n--> Fabric client user & Gateway init: Using ElectionCommissionOrg identity to ElectionCommissionOrg Peer"
  );

  const walletElectionCommission = await buildWallet(
    Wallets,
    walletPathElectionCommission
  );

  // in a real application this would be done on an administrative flow, and only once
  // stores admin identity in local wallet, if needed
  await enrollAdmin(
    caElectionCommissionClient,
    walletElectionCommission,
    electionCommissionOrg,
    adminUserId,
    adminUserPassword
  );

  try {
    //connect using Discovery enabled
    await gatewayElectionCommission.connect(ccpElectionCommissionOrg, {
      wallet: walletElectionCommission,
      identity: adminUserId,
      discovery: { enabled: true, asLocalhost: true },
    });
  } catch (error) {
    console.error(
      `Error in connecting to gateway for ElectionCommissionOrg: ${error}`
    );
    process.exit(1);
  }
}

export async function createNewAdmin(
  adminUserId: string,
  adminUserPassword: string,
  bootstrapAdminId: string
) {
  const walletElectionCommission = await buildWallet(
    Wallets,
    walletPathElectionCommission
  );

  await enrollNewAdmin(
    caElectionCommissionClient,
    walletElectionCommission,
    electionCommissionOrg,
    adminUserId,
    adminUserPassword,
    bootstrapAdminId
  );
}

export async function createUser(
  userId: string,
  userPassword: string,
  adminUserId: string
) {
  console.log("Register and enroll a new User:");
  const walletElectionCommission = await buildWallet(
    Wallets,
    walletPathElectionCommission
  );

  await registerAndEnrollUser(
    caElectionCommissionClient,
    walletElectionCommission,
    electionCommissionOrg,
    userId,
    userPassword,
    "",
    adminUserId
  );
}

export async function getElectionContractAndGateway() {
  try {
    /** ******* Fabric client init: Using ElectionCommission identity to ElectionCommission Peer ******* */
    const networkElectionCommission =
      await gatewayElectionCommission.getNetwork(channelName);
    const contractElectionCC =
      networkElectionCommission.getContract(electionCC);

    return contractElectionCC;
  } catch (error) {
    console.error(`Error in setup: ${error}`);
    process.exit(1);
  }
}

export async function getCandidateContractAndGateway() {
  try {
    /** ******* Fabric client init: Using ElectionCommission identity to ElectionCommission Peer ******* */
    const networkElectionCommission =
      await gatewayElectionCommission.getNetwork(channelName);
    const contractCandidateCC =
      networkElectionCommission.getContract(candidateCC);

    return contractCandidateCC;
  } catch (error) {
    console.error(`Error in setup: ${error}`);
    process.exit(1);
  }
}

export async function getVoteTallyContractAndGateway() {
  try {
    /** ******* Fabric client init: Using ElectionCommission identity to ElectionCommission Peer ******* */
    const networkElectionCommission =
      await gatewayElectionCommission.getNetwork(channelName);
    const contractVoteTallyCC =
      networkElectionCommission.getContract(voteTallyCC);

    return contractVoteTallyCC;
  } catch (error) {
    console.error(`Error in setup: ${error}`);
    process.exit(1);
  }
}
