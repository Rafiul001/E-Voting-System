import { ObjectId } from "mongodb";

export interface IAdminModel {
  _id?: ObjectId;
  userName: string;
  userEmail: string;
  password: string;
}

export class AdminModel implements IAdminModel {
  _id?: ObjectId;
  userName: string;
  userEmail: string;
  password: string;

  constructor(
    userName: string,
    userEmail: string,
    password: string,
    _id?: ObjectId
  ) {
    this._id = _id ? _id : new ObjectId();
    this.userName = userName;
    this.userEmail = userEmail;
    this.password = password;
  }
}
