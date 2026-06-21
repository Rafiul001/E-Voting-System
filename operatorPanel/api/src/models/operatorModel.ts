import { ObjectId } from "mongodb";

interface IOperatorModel {
  _id?: ObjectId;
  operatorId: string;
  operatorPassword: string;
  isRevoked?: boolean;
}

export class OperatorModel implements IOperatorModel {
  _id?: ObjectId;
  operatorId: string;
  operatorPassword: string;
  isRevoked?: boolean;

  constructor(
    operatorId: string,
    operatorPassword: string,
    _id?: ObjectId,
    isRevoked?: boolean
  ) {
    this._id = _id ? _id : new ObjectId();
    this.operatorId = operatorId;
    this.operatorPassword = operatorPassword;
    this.isRevoked = isRevoked !== undefined ? isRevoked : false;
  }
}
