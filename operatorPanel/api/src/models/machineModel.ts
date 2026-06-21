interface IMachineModel {
  _id?: string;
  machineId: string;
  machinePassword: string;
  divisionName: string;
  districtName: string;
  constituencyNumber: number;
  constituencyName: string;
  isRevoked?: boolean;
}

export class MachineModel implements IMachineModel {
  _id?: string;
  machineId: string;
  machinePassword: string;
  divisionName: string;
  districtName: string;
  constituencyNumber: number;
  constituencyName: string;
  isRevoked?: boolean;

  constructor(
    machineId: string,
    machinePassword: string,
    divisionName: string,
    districtName: string,
    constituencyNumber: number,
    constituencyName: string,
    _id?: string,
    isRevoked?: boolean
  ) {
    this._id = _id;
    this.machineId = machineId;
    this.machinePassword = machinePassword;
    this.divisionName = divisionName;
    this.districtName = districtName;
    this.constituencyNumber = constituencyNumber;
    this.constituencyName = constituencyName;
    this.isRevoked = isRevoked !== undefined ? isRevoked : false;
  }
}
