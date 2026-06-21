import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useAuthStore } from "../store/AuthStore";
import { toast } from "react-toastify";

type TPermitRecord = {
  permitKey: string;
  electionId: string;
  voterId: string;
  operatorId: string;
  issuedAt: string;
  status: string;
  spentAt: string;
};

const Home: React.FC = () => {
  const [voterId, setVoterId] = useState<string>("");
  const [voterData, setVoterData] = useState<{
    isVerified: boolean;
    voterId: string;
    voterName: string;
  }>();
  const operatorId = useAuthStore((s) => s.userName);
  const token = useAuthStore((state) => state.accessToken);
  const config = { headers: { Authorization: `Bearer ${token}` } };

  const [electionList, setElectionList] = useState<
    {
      electionId: string;
      electionName: string;
      status: string;
      updatedAt: string;
    }[]
  >([]);
  const [selectedElectionId, setSeletedElectionId] = useState<string>("");
  const [isCheckPermitClicked, setIsCheckPermitClicked] =
    useState<boolean>(false);
  const [permitRecord, setPermitRecord] = useState<TPermitRecord>();
  const [machineId, setMachineId] = useState<string>("");

  // -----------------------------
  // 🔥 1. WebSocket Setup
  // -----------------------------
  const ws = useRef<WebSocket | null>(null);

  const connectWebSocket = () => {
    ws.current = new WebSocket("ws://localhost:4000");

    ws.current.onopen = () => {
      console.log("🟢 Operator Connected to WebSocket");

      // Register Operator
      ws.current?.send(
        JSON.stringify({
          type: "REGISTER",
          clientId: operatorId,
        })
      );
    };

    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("📩 Message From Machine:", data);

      if (data.message === "vote is given") {
        toast.success(`Machine ${data.from} confirms vote is given!`, {
          position: "top-right",
          autoClose: 2000,
          theme: "dark",
        });

        // Update permit status locally
        if (permitRecord) {
          setPermitRecord({
            ...permitRecord,
            status: "spent",
            spentAt: new Date().toISOString(),
          });
        }
      }
    };

    ws.current.onclose = () => {
      console.log("🔴 WS Disconnected. Reconnecting...");
      setTimeout(connectWebSocket, 1000);
    };
  };

  useEffect(() => {
    if (operatorId) connectWebSocket();
  }, [operatorId]);

  // -----------------------------
  // 🔥 2. Send Permit Key to Machine
  // -----------------------------
  const sendPermitToMachine = () => {
    if (!permitRecord || !machineId) return;

    ws.current?.send(
      JSON.stringify({
        type: "SEND_TO",
        targetId: machineId,
        message: {
          permitKey: permitRecord.permitKey,
          electionId: permitRecord.electionId, // 🔥 Add this
        },
      })
    );

    toast.info(`Permit sent to machine ${machineId}`, { theme: "dark" });
  };

  // -----------------------------
  // 🔥 3. Existing axios logic for voter verification, permit issuing...
  // -----------------------------
  useEffect(() => {
    if (operatorId) {
      axios
        .get(
          `http://localhost:3001/api/v1/election/all-election/${operatorId}`,
          config
        )
        .then((res) => setElectionList(res.data.data))
        .catch((err) => console.log(err));
    }
  }, [operatorId]);

  const verifyVoter = async () => {
    if (!voterId)
      return toast.info("Enter a voter id first!", { theme: "light" });

    try {
      const res = await axios.get(
        `http://localhost:3001/api/v1/voter/get/${voterId}`,
        config
      );
      setVoterData(res.data.data);
      toast.success(res.data.message, { theme: "light" });
    } catch (err) {
      setVoterData(undefined);
      toast.error("Invalid voter or server error.", { theme: "light" });
    }
  };

  const checkPermitStatus = async () => {
    try {
      const res = await axios.post(
        "http://localhost:3001/api/v1/permit/get-permit",
        { voterId, electionId: selectedElectionId, operatorId },
        config
      );

      if (res.data.data) setPermitRecord(res.data.data);
      toast.info(res.data.message, { theme: "light" });
      setIsCheckPermitClicked(true);
    } catch (err) {
      console.error(err);
    }
  };

  const issuePermit = async () => {
    try {
      const permitKey = `PERMIT_${crypto.randomUUID()}`;
      const res = await axios.post(
        "http://localhost:3001/api/v1/permit/issue-permit",
        { permitKey, voterId, operatorId, electionId: selectedElectionId },
        config
      );

      if (res.data.data) setPermitRecord(res.data.data);
      toast.info(res.data.message, { theme: "light" });
      setIsCheckPermitClicked(true);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    setVoterData(undefined);
    setIsCheckPermitClicked(false);
    setPermitRecord(undefined);
  }, [voterId]);

  // -----------------------------
  // JSX
  // -----------------------------
  return (
    <div className="text-white max-w-4xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-8 text-blue-400">
        Permit Verification System
      </h1>
      {/* Election Select */}
      <div className="bg-gray-900 p-5 rounded-lg shadow mb-6">
        <label className="block mb-2 font-semibold">Select Election:</label>
        <select
          onChange={(e) => setSeletedElectionId(e.target.value)}
          className="w-full p-3 rounded bg-gray-800 text-white outline-none"
        >
          <option value="">--</option>
          {electionList.map((election) => (
            <option key={election.electionId} value={election.electionId}>
              {election.electionName}
            </option>
          ))}
        </select>
      </div>
      {/* Voter ID */}
      {selectedElectionId && (
        <div className="bg-gray-900 p-5 rounded-lg shadow mb-6">
          <label className="block mb-2 font-semibold">Enter Voter ID:</label>
          <input
            type="text"
            value={voterId}
            onChange={(e) => setVoterId(e.target.value)}
            className="w-full p-3 rounded bg-gray-800 text-white outline-none"
            placeholder="Enter voter ID"
          />
        </div>
      )}
      <button
        onClick={verifyVoter}
        className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded font-semibold transition mb-6"
      >
        Verify Voter
      </button>
      {/* Voter Details */}
      {selectedElectionId && voterData && (
        <>
          <div className="mt-6 bg-gray-900 p-5 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-3 text-blue-300">
              Voter Details
            </h2>
            <div className="space-y-1 text-gray-300">
              <p>
                <strong>ID:</strong> {voterData.voterId}
              </p>
              <p>
                <strong>Name:</strong> {voterData.voterName}
              </p>
              <p>
                <strong>Verified:</strong> {voterData.isVerified ? "Yes" : "No"}
              </p>
            </div>
          </div>

          <button
            onClick={checkPermitStatus}
            className="bg-indigo-600 hover:bg-indigo-700 px-6 py-3 rounded font-semibold transition mt-4"
          >
            Check Permit
          </button>
        </>
      )}
      {/* Issue Permit Button */}
      {selectedElectionId &&
        voterData &&
        isCheckPermitClicked &&
        !permitRecord && (
          <button
            onClick={issuePermit}
            className="mt-6 bg-green-600 hover:bg-green-700 px-6 py-3 rounded font-semibold transition"
          >
            Issue Permit
          </button>
        )}
      {/* Permit Issued */}{" "}
      {selectedElectionId &&
        voterData &&
        permitRecord &&
        permitRecord.status === "issued" && (
          <div className="mt-6 bg-gray-900 p-5 rounded-lg shadow space-y-2">
            {" "}
            <h3 className="text-xl font-semibold text-green-400">
              {" "}
              Permit Information{" "}
            </h3>{" "}
            <p>
              {" "}
              <strong>Permit Key:</strong> {permitRecord.permitKey}{" "}
            </p>{" "}
            <p>
              {" "}
              <strong>Operator ID:</strong> {permitRecord.operatorId}{" "}
            </p>{" "}
            <p>
              {" "}
              <strong>Voter ID:</strong> {permitRecord.voterId}{" "}
            </p>{" "}
            <p>
              {" "}
              <strong>Status:</strong> {permitRecord.status}{" "}
            </p>{" "}
            <p>
              {" "}
              <strong>Issued At:</strong>{" "}
              {new Date(permitRecord.issuedAt).toLocaleString()}{" "}
            </p>{" "}
          </div>
        )}{" "}
      {/* Already Spent */}{" "}
      {selectedElectionId &&
        voterData &&
        permitRecord &&
        permitRecord.status === "spent" && (
          <div className="mt-6 bg-gray-900 p-5 rounded-lg shadow space-y-2">
            {" "}
            <h3 className="text-xl font-semibold text-red-400">
              {" "}
              Permit Already Used{" "}
            </h3>{" "}
            <p>
              {" "}
              <strong>Permit Key:</strong> {permitRecord.permitKey}{" "}
            </p>{" "}
            <p>
              {" "}
              <strong>Operator ID:</strong> {permitRecord.operatorId}{" "}
            </p>{" "}
            <p>
              {" "}
              <strong>Voter ID:</strong> {permitRecord.voterId}{" "}
            </p>{" "}
            <p>
              {" "}
              <strong>Status:</strong> {permitRecord.status}{" "}
            </p>{" "}
            <p>
              {" "}
              <strong>Spent At:</strong>{" "}
              {new Date(permitRecord.spentAt).toLocaleString()}{" "}
            </p>{" "}
            <h2 className="text-red-500 font-bold text-lg">Already Voted</h2>{" "}
          </div>
        )}
      {/* Machine ID input to send permit */}
      {permitRecord && permitRecord.status === "issued" && (
        <div className="mt-6 bg-gray-900 p-5 rounded-lg shadow">
          <label className="block mb-2 font-semibold">Machine ID:</label>
          <input
            type="text"
            value={machineId}
            onChange={(e) => setMachineId(e.target.value)}
            placeholder="Enter Machine ID to send permit"
            className="w-full p-3 rounded bg-gray-800 text-white outline-none"
          />
          <button
            onClick={sendPermitToMachine}
            className="mt-3 bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded font-semibold transition"
          >
            Send Permit to Machine
          </button>
        </div>
      )}
    </div>
  );
};

export default Home;
