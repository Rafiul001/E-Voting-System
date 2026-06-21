import z from "zod";
import { AFFILIATION_TYPE } from "../../src/models/candidateModel";

const constituencyDetails = z.object({
  constituencyNumber: z.number(),
  constituencyName: z.string(),
});

// Read operations
export const getAllCandidateParams = z.object({
  electionId: z.string(),
});

export const getAllCandidateResponse = z.object({
  message: z.string(),
  candidateList: z.array(
    z.object({
      _id: z.string(),
      candidateName: z.string(),
      voterId: z.string(),
      electionId: z.string(),
      constituency: constituencyDetails,
      affiliationType: z.enum(
        Object.values(AFFILIATION_TYPE) as [string, ...string[]]
      ),
      partyName: z.string().optional(),
    })
  ),
});

// Create operations
export const createCandidateBody = z
  .object({
    voterId: z.string(),
    electionId: z.string(),
    constituency: constituencyDetails,
    candidateName: z.string(),
    affiliationType: z.enum(
      Object.values(AFFILIATION_TYPE) as [string, ...string[]]
    ),
    partyName: z.string().optional(),
  })
  .refine(
    (data) =>
      (data.affiliationType === AFFILIATION_TYPE.INDEPENDENT &&
        !data.partyName) ||
      (data.affiliationType === AFFILIATION_TYPE.DEPENDENT && !!data.partyName),
    {
      message:
        "Party name is required for dependent candidates and must not be set for independent candidates",
      path: ["partyName"],
    }
  );

export const createCandidateResponse = z.object({
  message: z.string(),
  candidate: z.object({
    _id: z.string(),
    candidateName: z.string(),
    voterId: z.string(),
    constituency: constituencyDetails,
    electionId: z.string(),
    affiliationType: z.enum(
      Object.values(AFFILIATION_TYPE) as [string, ...string[]]
    ),
    partyName: z.string().optional(),
  }),
});

// Delete operations
export const deleteCandidateParams = z.object({
  candidateObjectId: z.string(),
});

export const deleteCandidateResponse = z.object({
  message: z.string(),
  candidate: z.object({
    _id: z.string(),
    candidateName: z.string(),
    voterId: z.string(),
    constituency: constituencyDetails,
    electionId: z.string(),
    affiliationType: z.enum(
      Object.values(AFFILIATION_TYPE) as [string, ...string[]]
    ),
    partyName: z.string().optional(),
  }),
});

// Update Operations
export const updateCandidateParams = z.object({
  voterId: z.string(),
});

export const updateCandidateBody = z
  .object({
    affiliationType: z
      .enum(Object.values(AFFILIATION_TYPE) as [string, ...string[]])
      .optional(),
    partyName: z.string().optional(),
  })
  .refine(
    (data) => {
      if (!data.affiliationType) return true; // skip if not updating type
      return (
        (data.affiliationType === AFFILIATION_TYPE.INDEPENDENT &&
          !data.partyName) ||
        (data.affiliationType === AFFILIATION_TYPE.DEPENDENT &&
          !!data.partyName)
      );
    },
    {
      message: "Party name must align with affiliation type when updating",
      path: ["partyName"],
    }
  );

export const updateCandidateResponse = z.object({
  message: z.string(),
  candidate: z.object({
    _id: z.string(),
    candidateName: z.string(),
    voterId: z.string(),
    constituency: constituencyDetails,
    electionId: z.string(),
    affiliationType: z.enum(
      Object.values(AFFILIATION_TYPE) as [string, ...string[]]
    ),
    partyName: z.string().optional(),
  }),
});
