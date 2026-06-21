import z from "zod";

const upazilaAddress = z.object({
  upazilaName: z.string(),
  unionName: z.string(),
  wardNumber: z.number(),
});

const cityCorporationAddress = z.object({
  cityCorporationName: z.string(),
  wardNumber: z.number(),
});

const constituency = z
  .object({
    divisionName: z.string(),
    districtName: z.string(),
    constituencyNumber: z.number(),
    constituencyName: z.string(),
    homeAddress: z.string(),
    upazila: upazilaAddress.optional(),
    cityCorporation: cityCorporationAddress.optional(),
  })
  .refine((data) => data.upazila || data.cityCorporation, {
    message: "Either upazila or cityCorporation must be provided",
  });

// Get all voters depending on ward number
export const getAllWardVotersBody = z.object({
  divisionName: z.string(),
  districtName: z.string(),
  constituencyNumber: z.number(),
  constituencyName: z.string(),
  upazila: upazilaAddress.optional(),
  cityCorporation: cityCorporationAddress.optional(),
});

export const getAllVotersResponse = z.object({
  message: z.string(),
  voterList: z.array(
    z.object({
      _id: z.string(),
      voterId: z.string(),
      voterName: z.string(),
      dateOfBirth: z.string(),
      constituency: constituency,
    })
  ),
});

// Create voter
export const createVoterBody = z.object({
  voterId: z.string(),
  voterName: z.string(),
  dateOfBirth: z.string(),
  constituency: constituency,
});

export const createVoterResponse = z.object({
  message: z.string(),
});

// Delete a voter
export const deleteVoterParams = z.object({
  voterObjectId: z.string(),
});

export const deleteVoterResponse = z.object({
  message: z.string(),
});

// Update a voter
export const updateVoterParams = z.object({
  voterObjectId: z.string(),
});

export const updateVoterBody = z.object({
  voterName: z.string().optional(),
  dateOfBirth: z.string().optional(),
  homeAddress: z.string().optional(),
  constituency: constituency
    .partial()
    .optional()
    .refine((data) => !data || Object.keys(data).length > 0, {
      message: "Constituency must not be empty if provided",
    }),
});

export const updateVoterResponse = z.object({
  message: z.string(),
});
