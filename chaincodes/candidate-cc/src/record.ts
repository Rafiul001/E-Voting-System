/*
 * SPDX-License-Identifier: Apache-2.0
 */

import { Object, Property } from "fabric-contract-api";

export type TConstituency = {
  constituencyNumber: number;
  constituencyName: string;
};

export type TAffiliation = {
  affiliation: string;
  partyName: string;
};

@Object()
export class CandidateRecord {
  @Property()
  public candidateId: string = "";

  @Property()
  public candidateName: string = "";

  @Property()
  public voterId: string = "";

  @Property()
  public electionId: string = "";

  @Property()
  public constituency: TConstituency[] = [];

  @Property()
  public affiliationType: TAffiliation = {
    affiliation: "",
    partyName: "",
  };

  @Property()
  public createdAt: string = "";

  @Property()
  public updatedAt: string = "";
}
