import { ObjectId } from "mongodb";

export interface IElectionModel {
  _id?: ObjectId;
  electionName: string;
}

export class ElectionModel {
  _id?: ObjectId;
  electionName: string;

  constructor(electionName: string, _id?: ObjectId) {
    this._id = _id ? _id : new ObjectId();
    this.electionName = electionName;
  }
}
