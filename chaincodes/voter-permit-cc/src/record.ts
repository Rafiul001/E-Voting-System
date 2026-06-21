/*
 * SPDX-License-Identifier: Apache-2.0
 */

import { Object, Property } from 'fabric-contract-api';

export const PermitStatus = {
    ISSUED: "issued",
    SPENT: "spent"
} as const

export type TPermitStatus = typeof PermitStatus[keyof typeof PermitStatus]


@Object()
export class PermitRecord {
    @Property()
    public permitKey: string = '';

    @Property()
    public electionId: string = '';

    @Property()
    public voterId: string = '';

    @Property()
    public status: TPermitStatus = PermitStatus.ISSUED;

    @Property()
    public operatorId: string = '';

    @Property()
    public issuedAt: string = '';

    @Property()
    public spentAt?: string = '';
}