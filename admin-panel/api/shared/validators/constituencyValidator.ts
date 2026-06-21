import z from "zod";

const union = z.object({
  unionName: z.string(),
  wards: z.array(z.number()),
});

const upazila = z.object({
  upazilaName: z.string(),
  unions: z.array(union),
});

const cityCorporation = z.object({
  cityCorporationName: z.string(),
  wards: z.array(z.number()),
});

const constituency = z.object({
  constituencyNumber: z.number(),
  constituencyName: z.string(),
  boundaries: z.object({
    upazilas: z.array(upazila).optional(),
    cityCorporations: z.array(cityCorporation).optional(),
  }),
});

const district = z.object({
  districtName: z.string(),
  constituencies: z.array(constituency),
});

// Read Operations
export const getAllConstituenciesResponse = z.object({
  message: z.string(),
  constituencyList: z.array(
    z.object({
      _id: z.string(),
      divisionName: z.string(),
      districts: z.array(district),
    })
  ),
});

// Create new division
export const createNewDivisionBody = z.object({
  divisionName: z.string(),
});

export const createNewDivisionResponse = z.object({
  message: z.string(),
  constituency: z.object({
    _id: z.string(),
    divisionName: z.string(),
    districts: z.array(district),
  }),
});

// Update a part of Constituency model
export const updateConstituencyPartParams = z.object({
  constituencyObjectId: z.string(),
});

export const updateConstituencyPartBody = z.object({
  divisionName: z.string().optional(),
  districts: z.array(district).optional(),
});

export const updateConstituencyPartResponse = z.object({
  message: z.string(),
  constituency: z.object({
    _id: z.string(),
    divisionName: z.string(),
    districts: z.array(district),
  }),
});

// Delete the whole Constituency with division
export const deleteConstituencyParams = z.object({
  constituencyObjectId: z.string(),
});

export const deleteConstituencyResponse = z.object({
  message: z.string(),
  constituency: z.object({
    _id: z.string(),
    divisionName: z.string(),
    districts: z.array(district),
  }),
});
