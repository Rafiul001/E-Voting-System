type TUnion = {
  unionName: string;
  wards: number[];
};

type TUpazila = {
  upazilaName: string;
  unions: TUnion[];
};

type TCityCorporation = {
  cityCorporationName: string;
  wards: number[];
};

export type TConstituency = {
  constituencyNumber: number;
  constituencyName: string;
  boundaries: {
    upazilas?: TUpazila[];
    cityCorporations?: TCityCorporation[];
  };
};

export type TDistrict = {
  districtName: string;
  constituencies: TConstituency[];
};

export type TConstituencyModel = {
  _id?: string;
  divisionName: string;
  districts: TDistrict[];
}