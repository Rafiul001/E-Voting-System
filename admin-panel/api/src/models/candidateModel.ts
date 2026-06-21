import { ObjectId } from "mongodb";
import { IElectionModel } from "./electionModel";
import { IVoterModel } from "./voterModel";

export const AFFILIATION_TYPE = {
  INDEPENDENT: "independent",
  DEPENDENT: "dependent",
} as const;

type TConstituencyDetails = {
  constituencyNumber: number;
  constituencyName: string;
};

export interface ICandidateModel {
  _id?: ObjectId;
  candidateName: string;
  voterId: IVoterModel["_id"];
  electionId: IElectionModel["_id"];
  constituency: TConstituencyDetails;
  affiliationType: (typeof AFFILIATION_TYPE)[keyof typeof AFFILIATION_TYPE];
  partyName?: string;
}

export class CandidateModel implements ICandidateModel {
  _id?: ObjectId;
  candidateName: string;
  voterId: IVoterModel["_id"];
  electionId: IElectionModel["_id"];
  constituency: TConstituencyDetails;
  affiliationType: (typeof AFFILIATION_TYPE)[keyof typeof AFFILIATION_TYPE];
  partyName?: string;

  constructor(
    candidateName: string,
    voterId: IVoterModel["_id"],
    electionId: IElectionModel["_id"],
    constituency: TConstituencyDetails,
    affiliationType: (typeof AFFILIATION_TYPE)[keyof typeof AFFILIATION_TYPE],
    partyName?: string,
    _id?: ObjectId
  ) {
    this._id = _id ? _id : new ObjectId();
    this.electionId = electionId;
    this.constituency = constituency;
    this.candidateName = candidateName;
    this.voterId = voterId;
    this.affiliationType = affiliationType;
    this.partyName = partyName;
  }
}
