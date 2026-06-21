import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useAuthStore } from "../store/AuthStore";
import { toast } from "react-toastify";

type TAffiliationType = {
  affiliation: string;
  partyName: string;
};

type TConstituencyDetails = {
  constituencyNumber: number;
  constituencyName: string;
};

interface ICandidateModel {
  candidateId: string;
  candidateName: string;
  voterId: string;
  electionId: string;
  constituency: TConstituencyDetails[];
  affiliationType: TAffiliationType;
  partyName: string;
}

const Home: React.FC = () => {
  const [candidateList, setCandidateList] = useState<ICandidateModel[]>([]);
  const [permitKey, setPermitKey] = useState<string>("");

  const machineId = useAuthStore((s) => s.userName);
  const token = useAuthStore((s) => s.accessToken);
  const { constituencyNumber, constituencyName } = useAuthStore();

  const config = { headers: { Authorization: `Bearer ${token}` } };

  const [electionId, setElectionId] = useState<string>();

  // 🚀 WebSocket Reference
  const ws = useRef<WebSocket | null>(null);

  // -----------------------------
  // 🔥 1. Connect WebSocket
  // -----------------------------
  const connectWebSocket = () => {
    ws.current = new WebSocket("ws://localhost:4000");

    ws.current.onopen = () => {
      console.log("🟢 Machine Connected to WebSocket");

      // Send Registration Payload to WS Server
      ws.current?.send(
        JSON.stringify({
          type: "REGISTER",
          clientId: machineId, // machineId as unique channel
        })
      );
    };

    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("📩 Message From WS Server:", data);

      if (data.message?.permitKey) {
        setPermitKey(data.message.permitKey);

        // 🔥 Add electionId
        if (data.message?.electionId) {
          setElectionId(data.message.electionId);
        }

        toast.success("Permit & Election ID Received!", {
          position: "top-right",
          autoClose: 1500,
          theme: "dark",
        });
      }
    };

    ws.current.onclose = () => {
      console.log("🔴 WS Disconnected. Reconnecting...");
      setTimeout(connectWebSocket, 1000);
    };
  };

  // Initialize WS
  useEffect(() => {
    if (machineId) connectWebSocket();
  }, [machineId]);

  // -----------------------------
  // 🔥 2. Fetch Candidate List when permit arrives
  // -----------------------------
  const getCandidateList = async () => {
    try {
      if (!constituencyNumber || !constituencyName) {
        return toast.error("Constituency info missing", { theme: "dark" });
      }

      const res = await axios.get(
        `http://localhost:3001/api/v1/candidate/get-all/${constituencyNumber}/${constituencyName}/${machineId}`,
        config
      );

      const responseJSONData = await res.data;
      setCandidateList(responseJSONData.data);
    } catch (error: any) {
      toast.error(error.response?.data.message, { theme: "dark" });
    }
  };

  useEffect(() => {
    if (permitKey) getCandidateList();
  }, [permitKey]);

  // -----------------------------
  // 🔥 3. Cast Vote → Return message to Operator
  // -----------------------------
  const giveVote = async (candidateInfo: {
    candidateId: string;
    electionId: string;
    constituencyNumber: number;
    constituencyName: string;
    permitKey: string;
    machineId: string;
  }) => {
    try {
      const res = await axios.post(
        `http://localhost:3001/api/v1/vote/cast-vote`,
        candidateInfo,
        config
      );

      const responseJSONData = await res.data;
      toast.success(responseJSONData.message, { theme: "light" });

      // 🔥 After vote is cast → send message to operator
      ws.current?.send(
        JSON.stringify({
          type: "SEND_TO",
          targetId: "operator-panel-001", // <-- change if operator uses different ID
          message: "vote is given",
        })
      );

      setPermitKey("");
    } catch (error: any) {
      toast.error(error.response?.data.message, { theme: "dark" });
      setPermitKey("");
    }
  };

  return (
    <div>
      <div className="overflow-x-auto mt-6">
        {machineId && permitKey && constituencyName && constituencyNumber ? (
          <table className="w-full border border-[#1f2937] backdrop-blur-xl bg-[#0d1117]/40 shadow-lg rounded-lg overflow-hidden text-xs sm:text-xs md:text-base text-center">
            <thead className="bg-[#111827]">
              <tr>
                <th className="border border-[#1f2937] px-2 py-2 text-indigo-300 uppercase tracking-wider">
                  Name
                </th>
                <th className="border border-[#1f2937] px-2 py-2 text-indigo-300 uppercase tracking-wider">
                  Affiliation
                </th>
                <th className="border border-[#1f2937] px-2 py-2 text-indigo-300 uppercase tracking-wider">
                  Party
                </th>
                <th className="border border-[#1f2937] px-2 py-2 text-indigo-300 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {candidateList.length === 0 ? (
                <tr>
                  <td
                    className="text-center py-4 text-gray-400 bg-[#0d1117]/50"
                    colSpan={7}
                  >
                    No candidates found.
                  </td>
                </tr>
              ) : (
                candidateList.map((c) => {
                  if (c.electionId === electionId)
                    return (
                      <tr
                        key={c.candidateId}
                        className="hover:bg-[#1a2234] transition-all duration-300"
                      >
                        <td className="border border-[#1f2937] px-3 py-2 text-gray-300">
                          {c.candidateName}
                        </td>

                        <td className="border border-[#1f2937] px-3 py-2 text-gray-300">
                          {c.affiliationType.affiliation}
                        </td>

                        <td className="border border-[#1f2937] px-3 py-2 text-gray-300">
                          {c.affiliationType.partyName}
                        </td>

                        <td className="border border-[#1f2937] px-3 py-3 text-center">
                          <button
                            className="px-4 py-2 rounded-md text-white font-semibold 
                        bg-gradient-to-r from-indigo-600 to-purple-600
                        hover:from-indigo-500 hover:to-purple-500
                        transition-all duration-300 shadow-lg"
                            onClick={() =>
                              giveVote({
                                candidateId: c.candidateId,
                                electionId: c.electionId,
                                constituencyName: constituencyName,
                                constituencyNumber: constituencyNumber,
                                machineId: machineId,
                                permitKey: permitKey,
                              })
                            }
                          >
                            Vote
                          </button>
                        </td>
                      </tr>
                    );
                })
              )}
            </tbody>
          </table>
        ) : null}
      </div>
    </div>
  );
};

export default Home;
