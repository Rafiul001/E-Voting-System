import z from "zod";

// Read Operations
export const getAllElectionsResponse = z.object({
  message: z.string(),
  electionList: z.array(
    z.object({
      _id: z.string(),
      electionName: z.string(),
    })
  ),
});

// Create an Election
export const createElectionBody = z.object({
  electionName: z.string(),
});

export const createElectionResponse = z.object({
  message: z.string(),
  election: z.object({
    _id: z.string(),
    electionName: z.string(),
  }),
});

// Delete an Election
export const deleteElectionParams = z.object({
  electionId: z.string(),
});

export const deleteElectionResponse = z.object({
  message: z.string(),
  election: z.object({
    _id: z.string(),
    electionName: z.string(),
  }),
});

// Start an election
export const startElectionParams = z.object({
  electionId: z.string(),
});

export const startElectionResponse = z.object({
  message: z.string(),
});

// Finish an election
export const finishElectionParams = z.object({
  electionId: z.string(),
});

export const finishElectionResponse = z.object({
  message: z.string(),
});
