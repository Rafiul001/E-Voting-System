/*
 * SPDX-License-Identifier: Apache-2.0
 */

import { Object, Property } from 'fabric-contract-api';

@Object()
export class TallyRecord {
    @Property()
    public tallyKey: string = '';
    
    @Property()
    public candidateId: string = '';

    @Property()
    public electionId: string = '';

    @Property()
    public constituencyNumber: number = 0;

    @Property()
    public constituencyName: string = '';

    @Property()
    public voteCount: number = 0;

    @Property()
    public createdAt: string = "";

    @Property()
    public updatedAt: string = "";
}
