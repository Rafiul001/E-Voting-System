export type TVoterBase = {
  divisionName: string;
  districtName: string;
  constituencyNumber: number;
  constituencyName: string;
  homeAddress: string;
};

export type TVoterConstituency =
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

export type TVoter = {
  _id: string;
  voterId: string;
  voterName: string;
  dateOfBirth: string;
  constituency: TVoterConstituency;
};
