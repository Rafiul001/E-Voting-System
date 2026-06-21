export type TCandidateConstituency = {
  constituencyName: string;
  constituencyNumber: number;
};

export type TCandidateAffiliationType = {
  affiliation: string;
  partyName: string;
};

export type TCandidateRecord = {
  candidateId: string;
  candidateName: string;
  voterId: string;
  electionId: string;
  constituency: TCandidateConstituency[];
  affiliationType: TCandidateAffiliationType;
  createdAt: string;
  updatedAt: string;
};

export type TCreateCandidate = {
  candidateName: string;
  voterId: string;
  electionId: string;
  constituencyNumber: number;
  constituencyName: string;
  affiliation: string;
  partyName: string;
};

export type TAddConstituencyForCandidate = {
  candidateId: string;
  electionId: string;
  constituencyNumber: number;
  constituencyName: string;
};

export type TRemoveConstituencyForCandidate = {
  candidateId: string;
  electionId: string;
  constituencyNumber: number;
  constituencyName: string;
};
