/*
 * SPDX-License-Identifier: Apache-2.0
 */

import { Context, Contract, Info, Transaction } from "fabric-contract-api";
import { ElectionStatusRecord, PermitStatus, TPermitStatus } from "./record";
// import { KeyEndorsementPolicy } from 'fabric-shim';
import * as crypto from "crypto";

@Info({
  title: "Election Contract",
  description: "Election Smart Contract, implemented in TypeScript",
})
export class ElectionContract extends Contract {
  /**
   * Initialize the election poll
   * - Client provides: electionId
   */
  @Transaction()
  public async Initialize(
    ctx: Context,
    electionId: string,
    electionName: string
  ): Promise<string> {
    this._require(electionName, "electionName is required");
    this._require(electionId, "electionId is required");
    try {
      const exists = await this.electionExists(ctx, electionName);
      if (exists) {
        return JSON.stringify({
          message: `This election is exists with election name: ${electionName}`,
          data: null,
        });
      }

      const txTime = ctx.stub.getTxTimestamp();
      const now = new Date(txTime.seconds.low * 1000).toISOString();

      const electionRecord: ElectionStatusRecord = {
        electionId,
        electionName,
        status: PermitStatus.INITIALIZED,
        updatedAt: now,
      };

      await ctx.stub.putState(
        electionRecord.electionId,
        Buffer.from(JSON.stringify(electionRecord))
      );

      // return `Election has been initialized with election ID : ${electionId}`;
      return JSON.stringify({
        message: "Election has been initialized",
        data: electionRecord,
      });
    } catch (error) {
      return JSON.stringify({
        message: `Internal server error: ${JSON.stringify(error)} | ${error}`,
        data: null,
      });
    }
  }

  /**
   * Start election
   * - Start the election calling this function
   */

  @Transaction()
  public async StartElection(
    ctx: Context,
    electionId: string
  ): Promise<string> {
    this._require(electionId, "electionId is required");

    try {
      const electionBytes = await ctx.stub.getState(electionId);
      if (electionBytes.length === 0) {
        return JSON.stringify({
          message: "Election is not found",
          data: null,
        });
      }

      const electionRec = JSON.parse(
        electionBytes.toString()
      ) as ElectionStatusRecord;

      if (electionRec.status === PermitStatus.STARTED) {
        return JSON.stringify({
          message: "This election is already started",
          data: null,
        });
      }

      electionRec.status = PermitStatus.STARTED;
      const txTime = ctx.stub.getTxTimestamp();
      const now = new Date(txTime.seconds.low * 1000).toISOString();
      electionRec.updatedAt = now;

      const isAlreadyFinished = await this.checkAlreadyFinished(
        ctx,
        electionId
      );

      if (isAlreadyFinished)
        return JSON.stringify({
          message: "This election is already finished",
          data: null,
        });

      await ctx.stub.putState(
        electionId,
        Buffer.from(JSON.stringify(electionRec))
      );

      return JSON.stringify({
        message: "Election is started",
        data: electionRec,
      });
    } catch (error) {
      return JSON.stringify({
        message: `Internal server error: ${JSON.stringify(error)} | ${error}`,
        data: null,
      });
    }
  }

  /**
   * Finish election
   * - Finish the election by calling this function
   */
  @Transaction()
  public async FinishElection(
    ctx: Context,
    electionId: string
  ): Promise<string> {
    this._require(electionId, "electionId is required");

    try {
      const electionBytes = await ctx.stub.getState(electionId);
      if (electionBytes.length === 0) {
        return JSON.stringify({
          message: "Election is not found",
          data: null,
        });
      }

      const electionRec = JSON.parse(
        electionBytes.toString()
      ) as ElectionStatusRecord;

      if (electionRec.status === PermitStatus.FINISHED) {
        return JSON.stringify({
          message: "This election is already finished",
          data: null,
        });
      }

      electionRec.status = PermitStatus.FINISHED;
      const txTime = ctx.stub.getTxTimestamp();
      const now = new Date(txTime.seconds.low * 1000).toISOString();
      electionRec.updatedAt = now;

      await ctx.stub.putState(
        electionId,
        Buffer.from(JSON.stringify(electionRec))
      );

      return JSON.stringify({
        message: "Election has been finished",
        data: electionRec,
      });
    } catch (error) {
      return JSON.stringify({
        message: `Internal server error: ${JSON.stringify(error)} | ${error}`,
        data: null,
      });
    }
  }

  // Utility guard
  private _require(cond: any, msg: string): void {
    if (!cond) throw new Error(msg);
  }

  @Transaction(false)
  public async getAllElection(ctx: Context): Promise<string> {
    const electionList: ElectionStatusRecord[] = [];
    const iter = await ctx.stub.getStateByRange("", "");
    try {
      while (true) {
        const result = await iter.next();
        if (result.value && result.value.value) {
          const record = JSON.parse(
            result.value.value.toString()
          ) as ElectionStatusRecord;
          electionList.push(record);
        }

        if (result.done) {
          await iter.close();
          break;
        }
      }
    } finally {
      await iter.close(); // make sure it's always closed
    }
    return JSON.stringify({
      message: "Successfully get the list",
      data: electionList,
    });
  }

  @Transaction(false)
  public async getElectionById(
    ctx: Context,
    electionId: string
  ): Promise<string> {
    try {
      const existingElectionBytes = await ctx.stub.getState(electionId);
      if (existingElectionBytes.length === 0) {
        return JSON.stringify({
          message: "Election not found",
          data: null,
        });
      }
      const election = JSON.parse(existingElectionBytes.toString());

      return JSON.stringify({
        message: "Successfully get the election",
        data: election,
      });
    } catch (error) {
      return JSON.stringify({
        message: `Internal server error: ${JSON.stringify(error)} | ${error}`,
        data: null,
      });
    }
  }

  @Transaction(false)
  public async electionExists(
    ctx: Context,
    electionName: string
  ): Promise<boolean> {
    // Create a CouchDB rich query
    const queryString = {
      selector: {
        electionName: electionName,
      },
    };

    const iterator = await ctx.stub.getQueryResult(JSON.stringify(queryString));
    const result = await iterator.next();

    // If there’s at least one record found, it exists
    const exists = !result.done;

    await iterator.close();
    return exists;
  }

  @Transaction(false)
  public async isStarted(ctx: Context, electionId: string): Promise<boolean> {
    const electionBytes = await ctx.stub.getState(electionId);
    const electionRec = JSON.parse(
      electionBytes.toString()
    ) as ElectionStatusRecord;

    if (electionRec.status === PermitStatus.STARTED) {
      return true;
    } else {
      return false;
    }
  }

  @Transaction(false)
  public async checkAlreadyFinished(
    ctx: Context,
    electionId: string
  ): Promise<boolean> {
    const iterator = await ctx.stub.getHistoryForKey(electionId);
    try {
      while (true) {
        const res = await iterator.next();

        if (res.done) break;

        if (res.value && res.value.value.toString()) {
          const value = JSON.parse(res.value.value.toString()) as {
            electionId: string;
            status: TPermitStatus;
            updatedAt: string;
          };

          if (value.status === PermitStatus.FINISHED) {
            return true;
          }
        }
      }
      return false;
    } finally {
      await iterator.close();
    }
  }
}
