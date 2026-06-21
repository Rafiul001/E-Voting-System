import { Context, Contract, Info, Transaction } from "fabric-contract-api";
import { PermitRecord, PermitStatus } from "./record";

const electionCCName = "electioncc";
const votingChannel = "votingchannel";

@Info({
  title: "VoterPermitContract",
  description:
    "Voter Permit Smart Contract, using State Based Endorsement(SBE), implemented in TypeScript",
})
export class VoterPermitContract extends Contract {
  /**
   * IssuePermit
   */
  @Transaction()
  public async IssuePermit(
    ctx: Context,
    permitKey: string,
    voterId: string,
    operatorId: string,
    electionId: string
  ): Promise<string> {
    this._require(
      electionId && voterId && operatorId,
      "electionId, voterId, and operatorId are required"
    );

    try {
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

      const existingPermitString = await this.getPermit(
        ctx,
        voterId,
        electionId
      );

      const existingPermit = JSON.parse(existingPermitString) as {
        message: string;
        data: PermitRecord | null;
      };

      if (existingPermit.data) {
        if (existingPermit.data.status === PermitStatus.ISSUED) {
          return JSON.stringify({
            message: "Permit is already issued!",
            data: null,
          });
        }

        if (existingPermit.data.status === PermitStatus.SPENT) {
          return JSON.stringify({
            message: "Permit is already spent!",
            data: null,
          });
        }
      }

      const txTime = ctx.stub.getTxTimestamp();
      const now = new Date(txTime.seconds.low * 1000).toISOString();

      const newPermit: PermitRecord = {
        permitKey: permitKey,
        electionId: electionId,
        issuedAt: now,
        operatorId: operatorId,
        status: PermitStatus.ISSUED,
        voterId: voterId,
        spentAt: "",
      };

      await ctx.stub.putState(
        newPermit.permitKey,
        Buffer.from(JSON.stringify(newPermit))
      );

      return JSON.stringify({
        message: `New permit is issued with voter ID: ${newPermit.voterId}`,
        data: newPermit,
      });
    } catch (error) {
      return JSON.stringify({
        message: `Internal server error: ${error}`,
        data: null,
      });
    }
  }

  /**
   * SpendPermit
   */
  @Transaction()
  public async SpendPermit(
    ctx: Context,
    permitKey: string,
    electionId: string
  ): Promise<string> {
    this._require(
      permitKey && electionId,
      "permit key and election id are required"
    );

    try {
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

      const permitBytes = await ctx.stub.getState(permitKey);
      if (permitBytes.length === 0) {
        return JSON.stringify({
          message: "Permit not found",
          data: null,
        });
      }
      const permitObject = JSON.parse(permitBytes.toString()) as PermitRecord;

      if (permitObject.status === PermitStatus.SPENT) {
        return JSON.stringify({
          message: "Permit is already spent!",
          data: null,
        });
      }

      permitObject.status = PermitStatus.SPENT;
      const txTime = ctx.stub.getTxTimestamp();
      const now = new Date(txTime.seconds.low * 1000).toISOString();
      permitObject.spentAt = now;

      await ctx.stub.putState(
        permitKey,
        Buffer.from(JSON.stringify(permitObject))
      );

      return JSON.stringify({
        message: "Permit has been spent!",
        data: permitObject,
      });
    } catch (error) {
      return JSON.stringify({
        message: `Internal server error: ${error}`,
        data: null,
      });
    }
  }

  // Utility guard
  private _require(cond: any, msg: string): void {
    if (!cond) throw new Error(msg);
  }

  @Transaction(false)
  public async getPermit(
    ctx: Context,
    voterId: string,
    electionId: string
  ): Promise<string> {
    // Build CouchDB rich query
    const queryString = {
      selector: {
        voterId: voterId,
        electionId: electionId,
      },
    };

    // Execute the query
    const iterator = await ctx.stub.getQueryResult(JSON.stringify(queryString));
    const result = await iterator.next();

    let permit = null;

    if (!result.done && result.value) {
      // Parse the record into JSON
      permit = JSON.parse(result.value.value.toString());
    }

    await iterator.close();

    if (permit)
      return JSON.stringify({
        message: "Permit Found!",
        data: permit,
      });
    else
      return JSON.stringify({
        message: "Permit not found!",
        data: null,
      });
  }
}
