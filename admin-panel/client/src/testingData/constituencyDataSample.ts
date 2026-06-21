import type { TConstituencyModel } from "../types/ConstituencyType";

export const constituencyListSampleData: TConstituencyModel[] = [
  {
    _id: "div001",
    divisionName: "Dhaka",
    districts: [
      {
        districtName: "Dhaka",
        constituencies: [
          {
            constituencyNumber: 1,
            constituencyName: "Dhaka-1",
            boundaries: {
              upazilas: [
                {
                  upazilaName: "Dohar",
                  unions: [
                    { unionName: "Nawabganj Union", wards: [1, 2, 3] },
                    { unionName: "Dohar Union", wards: [4, 5] },
                  ],
                },
              ],
            },
          },
          {
            constituencyNumber: 2,
            constituencyName: "Dhaka-2",
            boundaries: {
              cityCorporations: [
                {
                  cityCorporationName: "Dhaka South City Corporation",
                  wards: [10, 11, 12],
                },
              ],
            },
          },
        ],
      },
    ],
  },
  {
    _id: "div002",
    divisionName: "Chattogram",
    districts: [
      {
        districtName: "Chattogram",
        constituencies: [
          {
            constituencyNumber: 3,
            constituencyName: "Chattogram-1",
            boundaries: {
              cityCorporations: [
                {
                  cityCorporationName: "Chattogram City Corporation",
                  wards: [1, 2, 3, 4],
                },
              ],
            },
          },
          {
            constituencyNumber: 4,
            constituencyName: "Chattogram-2",
            boundaries: {
              upazilas: [
                {
                  upazilaName: "Rangunia",
                  unions: [
                    { unionName: "Hosnabad Union", wards: [1, 2] },
                    { unionName: "Parua Union", wards: [3, 4] },
                  ],
                },
              ],
            },
          },
        ],
      },
    ],
  },
  {
    _id: "div003",
    divisionName: "Khulna",
    districts: [
      {
        districtName: "Khulna",
        constituencies: [
          {
            constituencyNumber: 5,
            constituencyName: "Khulna-1",
            boundaries: {
              cityCorporations: [
                {
                  cityCorporationName: "Khulna City Corporation",
                  wards: [1, 2, 3],
                },
              ],
            },
          },
        ],
      },
    ],
  },
  {
    _id: "div004",
    divisionName: "Rajshahi",
    districts: [
      {
        districtName: "Rajshahi",
        constituencies: [
          {
            constituencyNumber: 6,
            constituencyName: "Rajshahi-1",
            boundaries: {
              upazilas: [
                {
                  upazilaName: "Godagari",
                  unions: [
                    { unionName: "Deopara Union", wards: [1, 2, 3] },
                    { unionName: "Mohanpur Union", wards: [4, 5] },
                  ],
                },
              ],
            },
          },
        ],
      },
    ],
  },
  {
    _id: "div005",
    divisionName: "Sylhet",
    districts: [
      {
        districtName: "Sylhet",
        constituencies: [
          {
            constituencyNumber: 7,
            constituencyName: "Sylhet-1",
            boundaries: {
              upazilas: [
                {
                  upazilaName: "Beanibazar",
                  unions: [
                    { unionName: "Sheola Union", wards: [1, 2] },
                    { unionName: "Mathiura Union", wards: [3, 4, 5] },
                  ],
                },
              ],
            },
          },
        ],
      },
    ],
  },
  {
    _id: "div006",
    divisionName: "Rangpur",
    districts: [
      {
        districtName: "Rangpur",
        constituencies: [
          {
            constituencyNumber: 8,
            constituencyName: "Rangpur-1",
            boundaries: {
              cityCorporations: [
                {
                  cityCorporationName: "Rangpur City Corporation",
                  wards: [1, 2, 3, 4],
                },
              ],
            },
          },
        ],
      },
    ],
  },
  {
    _id: "div007",
    divisionName: "Barishal",
    districts: [
      {
        districtName: "Barishal",
        constituencies: [
          {
            constituencyNumber: 9,
            constituencyName: "Barishal-1",
            boundaries: {
              upazilas: [
                {
                  upazilaName: "Agailjhara",
                  unions: [{ unionName: "Rajiura Union", wards: [1, 2, 3] }],
                },
              ],
            },
          },
        ],
      },
    ],
  },
  {
    _id: "div008",
    divisionName: "Mymensingh",
    districts: [
      {
        districtName: "Mymensingh",
        constituencies: [
          {
            constituencyNumber: 10,
            constituencyName: "Mymensingh-1",
            boundaries: {
              upazilas: [
                {
                  upazilaName: "Trishal",
                  unions: [
                    { unionName: "Kanthal Union", wards: [1, 2] },
                    { unionName: "Trishal Union", wards: [3, 4] },
                  ],
                },
              ],
            },
          },
        ],
      },
    ],
  },
];
