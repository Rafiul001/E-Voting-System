import dotenv from "dotenv";

dotenv.config();

export const CollectionListNames = {
  VOTER: "voter",
  CONSTITUENCY: "constituency",
  ELECTION_COMMISSION_ADMIN: "election_commission_admin",
  OPERATOR: "operator",
  MACHINE: "machine",
  DISTRICT_COMMISSION_ADMIN: "district_commission_admin",
} as const;

interface IConfig {
  port: number;
  mongodbUrl: string;
  databaseName: string;
  collectionList: (typeof CollectionListNames)[keyof typeof CollectionListNames][];
  jwtPrivateKey: string;
}

const config: IConfig = {
  port: Number(process.env.PORT) || 3001,
  mongodbUrl: process.env.MONGODB_URL || "mongodb://localhost:27017/",
  databaseName: process.env.DATABASE_NAME || "EvotingSystem",
  collectionList: [
    CollectionListNames.VOTER,
    CollectionListNames.CONSTITUENCY,
    CollectionListNames.ELECTION_COMMISSION_ADMIN,
    CollectionListNames.OPERATOR,
    CollectionListNames.MACHINE,
    CollectionListNames.DISTRICT_COMMISSION_ADMIN,
  ],
  jwtPrivateKey: process.env.JWT_PRIVATE_KEY || "privatekey",
};

export default config;
