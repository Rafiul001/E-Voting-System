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
const voterPermitCC = "voterpermitcc";
const voteTallyCC = "votetallycc";
const electionCC = "electioncc";
const candidateCC = "candidatecc";

const districtCommissionOrg = "DistrictCommissionMSP";
// const adminId = "admin";

// build an in memory object with the network configuration (also known as a connection profile)
const ccpDistrictCommissionOrg = buildCCPOrg();

// setup the wallet to cache the credentials of the application user, on the app server locally
const walletPathDistrictCommission = path.join(
  __dirname,
  "wallet",
  "districtcommission"
);

// build an instance of the fabric ca services client based on
// the information in the network configuration
const caDistrictCommissionClient = buildCAClient(
  FabricCAServices,
  ccpDistrictCommissionOrg,
  "ca.districtCommission.example.com"
);

// Create a new gateway for connecting to Org's peer node.
export const gatewayDistrictCommission = new Gateway();

export async function initiallyEnrollAdminAndConnectGateway(
  adminUserId: string,
  adminUserPassword: string
) {
  console.log(
    "\n--> Fabric client user & Gateway init: Using DistrictCommissionOrg identity to DistrictCommissionOrg Peer"
  );

  const walletDistrictCommission = await buildWallet(
    Wallets,
    walletPathDistrictCommission
  );

  // in a real application this would be done on an administrative flow, and only once
  // stores admin identity in local wallet, if needed
  await enrollAdmin(
    caDistrictCommissionClient,
    walletDistrictCommission,
    districtCommissionOrg,
    adminUserId,
    adminUserPassword
  );

  // try {
  //   //connect using Discovery enabled
  //   await gatewayDistrictCommission.connect(ccpDistrictCommissionOrg, {
  //     wallet: walletDistrictCommission,
  //     identity: adminUserId,
  //     discovery: { enabled: true, asLocalhost: true },
  //   });
  // } catch (error) {
  //   console.error(
  //     `Error in connecting to gateway for DistrictCommissionOrg: ${error}`
  //   );
  //   process.exit(1);
  // }
}

export async function createNewAdmin(
  adminUserId: string,
  adminUserPassword: string,
  bootstrapAdminId: string
) {
  const walletDistrictCommission = await buildWallet(
    Wallets,
    walletPathDistrictCommission
  );

  await enrollNewAdmin(
    caDistrictCommissionClient,
    walletDistrictCommission,
    districtCommissionOrg,
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
  const walletDistrictCommission = await buildWallet(
    Wallets,
    walletPathDistrictCommission
  );

  try {
    await registerAndEnrollUser(
      caDistrictCommissionClient,
      walletDistrictCommission,
      districtCommissionOrg,
      userId,
      userPassword,
      "",
      adminUserId
    );
  } catch (error) {
    console.log(error);
  }
}

export async function revokeUser(userId: string, adminUserId: string) {
  console.log(`Revoking user: ${userId}`);
  const walletDistrictCommission = await buildWallet(
    Wallets,
    walletPathDistrictCommission
  );

  const adminIdentity = await walletDistrictCommission.get(adminUserId);
  if (!adminIdentity) {
    console.log(`Admin identity ${adminUserId} not found`);
    return;
  }

  const userIdentity = await walletDistrictCommission.get(userId);
  if (!userIdentity) {
    console.log(`User identity ${userId} not found`);
    return;
  }

  try {
    const provider = walletDistrictCommission
      .getProviderRegistry()
      .getProvider(adminIdentity.type);
    const adminUser = await provider.getUserContext(adminIdentity, adminUserId);

    // Revoke identity in CA
    await caDistrictCommissionClient.revoke(
      {
        enrollmentID: userId,
        reason: "cessationOfOperation",
      },
      adminUser
    );

    console.log(`✅ Successfully revooked user: ${userId}`);
  } catch (error) {
    console.log(error);
  }
}

export async function getVoterPermitContractAndGateway(identity: string) {
  try {
    /** ******* Fabric client init: Using ElectionCommission identity to ElectionCommission Peer ******* */
    const walletDistrictCommission = await buildWallet(
      Wallets,
      walletPathDistrictCommission
    );

    await gatewayDistrictCommission.connect(ccpDistrictCommissionOrg, {
      wallet: walletDistrictCommission,
      identity: identity,
      discovery: { enabled: true, asLocalhost: true },
    });

    const networkDistrictCommission =
      await gatewayDistrictCommission.getNetwork(channelName);
    const contractVoterPermitCC =
      networkDistrictCommission.getContract(voterPermitCC);

    return {
      gatewayDistrictCommission,
      contractVoterPermitCC,
    };
  } catch (error) {
    console.error(`Error in setup: ${error}`);
    process.exit(1);
  }
}

export async function getVoteTallyContractAndGateway(identity: string) {
  try {
    /** ******* Fabric client init: Using ElectionCommission identity to ElectionCommission Peer ******* */
    const walletDistrictCommission = await buildWallet(
      Wallets,
      walletPathDistrictCommission
    );

    await gatewayDistrictCommission.connect(ccpDistrictCommissionOrg, {
      wallet: walletDistrictCommission,
      identity: identity,
      discovery: { enabled: true, asLocalhost: true },
    });

    const networkDistrictCommission =
      await gatewayDistrictCommission.getNetwork(channelName);
    const contractVoteTallyCC =
      networkDistrictCommission.getContract(voteTallyCC);

    return {
      contractVoteTallyCC,
      gatewayDistrictCommission,
    };
  } catch (error) {
    console.error(`Error in setup: ${error}`);
    process.exit(1);
  }
}

export async function getElectionContractAndGateway(identity: string) {
  try {
    /** ******* Fabric client init: Using ElectionCommission identity to ElectionCommission Peer ******* */
    const walletDistrictCommission = await buildWallet(
      Wallets,
      walletPathDistrictCommission
    );

    await gatewayDistrictCommission.connect(ccpDistrictCommissionOrg, {
      wallet: walletDistrictCommission,
      identity: identity,
      discovery: { enabled: true, asLocalhost: true },
    });

    const networkDistrictCommission =
      await gatewayDistrictCommission.getNetwork(channelName);
    const contractElectionCC =
      networkDistrictCommission.getContract(electionCC);

    return {
      contractElectionCC,
      gatewayDistrictCommission,
    };
  } catch (error) {
    console.error(`Error in setup: ${error}`);
    process.exit(1);
  }
}

export async function getCandidateContractAndGateway(identity: string) {
  try {
    /** ******* Fabric client init: Using ElectionCommission identity to ElectionCommission Peer ******* */
    const walletDistrictCommission = await buildWallet(
      Wallets,
      walletPathDistrictCommission
    );

    await gatewayDistrictCommission.connect(ccpDistrictCommissionOrg, {
      wallet: walletDistrictCommission,
      identity: identity,
      discovery: { enabled: true, asLocalhost: true },
    });

    const networkDistrictCommission =
      await gatewayDistrictCommission.getNetwork(channelName);
    const contractCandidateCC =
      networkDistrictCommission.getContract(candidateCC);

    return {
      contractCandidateCC,
      gatewayDistrictCommission,
    };
  } catch (error) {
    console.error(`Error in setup: ${error}`);
    process.exit(1);
  }
}
