import { ObjectId } from "mongodb";

type TVoterBase = {
  divisionName: string;
  districtName: string;
  constituencyNumber: number;
  constituencyName: string;
  homeAddress: string;
};

type TVoterConstituency =
  | (TVoterBase & {
      upazila: {
        upazilaName: string;
        unionName: string;
        wardNumber: number;
      };
    })
  | (TVoterBase & {
      cityCorporation: {
        cityCorporationName: string;
        wardNumber: number;
      };
    });

export interface IVoterModel {
  _id?: ObjectId;
  voterId: string;
  voterName: string;
  dateOfBirth: string;
  constituency: TVoterConstituency;
}

export class VoterModel implements IVoterModel {
  _id?: ObjectId;
  voterId: string;
  voterName: string;
  dateOfBirth: string;
  constituency: TVoterConstituency;

  constructor(
    voterId: string,
    voterName: string,
    dateOfBirth: string,
    constituency: TVoterConstituency,
    _id?: ObjectId
  ) {
    this._id = _id ? _id : new ObjectId();
    this.voterId = voterId;
    this.voterName = voterName;
    this.dateOfBirth = dateOfBirth;
    this.constituency = constituency;
  }
}
