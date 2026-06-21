/*
 * SPDX-License-Identifier: Apache-2.0
 */

import { Context, Contract, Info, Transaction } from "fabric-contract-api";
import { TallyRecord } from "./tallyRecord";
import * as crypto from "crypto";

const electionCCName = "electioncc";
const voterPermitCCName = "voterpermitcc";
const votingChannel = "votingchannel";

// const PREFIX = {
//   TALLY: "TALLY", // TALLY#electionId#constituencyId#candidateId
// };

const objectType = "voteTally";

function sha256Hex(s: string): string {
  return crypto.createHash("sha256").update(s).digest("hex");
}

@Info({
  title: "VoteTallyContract",
  description:
    "Vote Tally Smart Contract, using State Based Endorsement(SBE), implemented in TypeScript",
})
export class VoteTallyContract extends Contract {
  // Casting Vote
  @Transaction()
  public async CastVote(
    ctx: Context,
    candidateId: string,
    electionId: string,
    constituencyNumber: string,
    constituencyName: string,
    permitKey: string
  ): Promise<string> {
    this._require(
      candidateId &&
        electionId &&
        constituencyNumber &&
        constituencyName &&
        permitKey,
      "candidateId, electionId, constituencyNumber, constituencyName and permitKey are required"
    );

    try {
      // Checking election status
      const electionString = await ctx.stub.invokeChaincode(
        electionCCName,
        ["getElectionById", electionId],
        votingChannel
      );

      if (!electionString.payload || electionString.payload.length === 0) {
        return JSON.stringify({
          message: `Election not found with id: ${electionId}, ${electionString.message}, ${electionString.status}`,
          data: null,
        });
      }

      const payloadString = Buffer.from(electionString.payload).toString(
        "utf8"
      );

      const electionResponse = await JSON.parse(payloadString);
      const election = electionResponse.data;

      if (election.status !== "started") {
        return JSON.stringify({
          message: `The election with this ID ${electionId} is not in started mode!`,
          data: null,
        });
      }

      // Spend the permit.
      const permitObjectString = await ctx.stub.invokeChaincode(
        voterPermitCCName,
        ["SpendPermit", permitKey, electionId],
        votingChannel
      );

      if (
        !permitObjectString.payload ||
        permitObjectString.payload.length === 0
      ) {
        return JSON.stringify({
          message: `Permit not found with permit Key: ${permitKey}, ${permitObjectString.message}, ${permitObjectString.status}`,
          data: null,
        });
      }

      const permitPayloadString = Buffer.from(
        permitObjectString.payload
      ).toString("utf8");

      const permitResponse = await JSON.parse(permitPayloadString);

      if (!permitResponse.data) {
        return JSON.stringify({
          message: permitResponse.message,
          data: null,
        });
      }

      // Cast vote
      // Create composite key
      const compositeTallyKey = ctx.stub.createCompositeKey(objectType, [
        electionId,
        constituencyNumber,
        constituencyName,
        candidateId,
      ]);

      // Check if a tally exists or not!
      const existingTallyString = await this.GetTally(
        ctx,
        electionId,
        constituencyNumber,
        constituencyName,
        candidateId
      );

      const existingTally = (await JSON.parse(existingTallyString)) as {
        message: string;
        data: TallyRecord | null;
      };

      const txTime = ctx.stub.getTxTimestamp();
      const now = new Date(txTime.seconds.low * 1000).toISOString();

      if (existingTally.data) {
        const newVoteCount = existingTally.data.voteCount + 1;
        // existingTally.data.voteCount += 1;
        const updatedAt = now;

        const updatedTally = {
          ...existingTally.data,
          voteCount: newVoteCount,
          updatedAt: updatedAt,
        };

        await ctx.stub.putState(
          compositeTallyKey,
          Buffer.from(JSON.stringify(updatedTally))
        );

        return JSON.stringify({
          message: "Successfully updated vote tally!",
          data: existingTally.data,
        });
      } else {
        const newTally: TallyRecord = {
          tallyKey: compositeTallyKey,
          candidateId: candidateId,
          constituencyName: constituencyName,
          constituencyNumber: Number(constituencyNumber),
          electionId: electionId,
          voteCount: 1,
          createdAt: now,
          updatedAt: "",
        };
        await ctx.stub.putState(
          compositeTallyKey,
          Buffer.from(JSON.stringify(newTally))
        );
        return JSON.stringify({
          message: "Successfully initialize new vote Talley",
          data: newTally,
        });
      }
    } catch (error) {
      return JSON.stringify({
        message: `Internal Server Error: ${error}`,
        data: null,
      });
    }
  }

  /*
   * Get tally for specific candidate
   */

  @Transaction(false)
  public async GetTally(
    ctx: Context,
    electionId: string,
    constituencyNumber: string,
    constituencyName: string,
    candidateId: string
  ): Promise<string> {
    this._require(
      candidateId && constituencyName && constituencyNumber && electionId,
      "candidateId, constituencyName, constituencyNumber and electionId are required!"
    );

    try {
      let tally = null;
      // Execute the query
      const existingTallyIterator =
        await ctx.stub.getStateByPartialCompositeKey(objectType, [
          electionId,
          constituencyNumber,
          constituencyName,
          candidateId,
        ]);

      const result = await existingTallyIterator.next();

      if (!result.done && result.value) {
        // Parse the record into JSON
        tally = await JSON.parse(result.value.value.toString());
      }

      await existingTallyIterator.close();

      if (tally)
        return JSON.stringify({
          message: "Tally Found!",
          data: tally,
        });
      else
        return JSON.stringify({
          message: "Tally not found!",
          data: null,
        });
    } catch (error) {
      return JSON.stringify({
        message: `Internal server error: ${error}`,
        data: null,
      });
    }
  }

  // Get all tallies for a constituency (returns an array)
  @Transaction()
  public async GetConstituencyTallies(
    ctx: Context,
    electionId: string,
    constituencyNumber: string,
    constituencyName: string
  ): Promise<string> {
    this._require(
      electionId && constituencyNumber && constituencyName,
      "missing inputs"
    );
    try {
      // Checking election status
      const electionString = await ctx.stub.invokeChaincode(
        electionCCName,
        ["getElectionById", electionId],
        votingChannel
      );

      if (!electionString.payload || electionString.payload.length === 0) {
        return JSON.stringify({
          message: `Election not found with id: ${electionId}, ${electionString.message}, ${electionString.status}`,
          data: null,
        });
      }

      const payloadString = Buffer.from(electionString.payload).toString(
        "utf8"
      );
      const electionResponse = await JSON.parse(payloadString);
      const election = electionResponse.data;

      if (election.status !== "finished") {
        return JSON.stringify({
          message: `The election with this ID ${electionId} is not finished yet!`,
          data: null,
        });
      }

      const iter = await ctx.stub.getStateByPartialCompositeKey(objectType, [
        electionId,
        constituencyNumber,
        constituencyName,
      ]);

      const results: TallyRecord[] = [];

      while (true) {
        const res = await iter.next();

        if (res.value && res.value.value) {
          const record = JSON.parse(res.value.value.toString()) as TallyRecord;
          results.push(record);
        }

        if (res.done) {
          await iter.close();
          break;
        }
      }

      return JSON.stringify({
        message: "Successfully get the list!",
        data: results,
      });
    } catch (error) {
      return JSON.stringify({
        message: `Internal server error: ${error}`,
        data: null,
      });
    }
  }

  // Get all tallies for an election (across all constituency)
  @Transaction()
  public async GetElectionTallies(
    ctx: Context,
    electionId: string
  ): Promise<string> {
    this._require(electionId, "missing electionId");
    try {
      // Checking election status
      const electionString = await ctx.stub.invokeChaincode(
        electionCCName,
        ["getElectionById", electionId],
        votingChannel
      );

      if (!electionString.payload || electionString.payload.length === 0) {
        return JSON.stringify({
          message: `Election not found with id: ${electionId}, ${electionString.message}, ${electionString.status}`,
          data: null,
        });
      }

      const payloadString = Buffer.from(electionString.payload).toString(
        "utf8"
      );
      const electionResponse = await JSON.parse(payloadString);
      const election = electionResponse.data;

      if (election.status !== "finished") {
        return JSON.stringify({
          message: `The election with this ID ${electionId} is not finished yet!`,
          data: null,
        });
      }

      const iter = await ctx.stub.getStateByPartialCompositeKey(objectType, [
        electionId,
      ]);

      let count = 0;

      while (true) {
        const res = await iter.next();

        if (res.value && res.value.value) {
          count += 1;
        }

        if (res.done) {
          await iter.close();
          break;
        }
      }

      return JSON.stringify({
        message: "Successfully get the count!",
        data: count,
      });
    } catch (error) {
      return JSON.stringify({
        message: `Internal server error: ${error}`,
        data: null,
      });
    }
  }

  private _require(cond: any, msg: string) {
    if (!cond) throw new Error(msg);
  }
}
