/*
 * SPDX-License-Identifier: Apache-2.0
 */

import { Object, Property } from "fabric-contract-api";

export const PermitStatus = {
  INITIALIZED: "initialized",
  STARTED: "started",
  FINISHED: "finished",
} as const;

export type TPermitStatus = (typeof PermitStatus)[keyof typeof PermitStatus];

@Object()
export class ElectionStatusRecord {
  @Property()
  public electionId: string = "";

  @Property()
  public electionName: string = "";

  @Property()
  public status: TPermitStatus = PermitStatus.INITIALIZED;

  @Property()
  public updatedAt: string = "";
}
