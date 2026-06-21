import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import Text from "../components/ui/Text";
import Container from "../components/ui/Container";
import { useConstituencyStore } from "../store/constituencyStore";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuthStore } from "../store/authStore";
import { useCandidateStore } from "../store/candidateStore";

const API_BASE_URL = "http://localhost:3000/api/v1/vote";

const getAxiosInstance = () => {
  const { token, logout } = useAuthStore.getState();

  const instance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });

  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        logout(true);
      }
      return Promise.reject(error);
    }
  );

  return instance;
};

const ViewResult: React.FC = () => {
  const { electionId } = useParams();

  const { candidateList } = useCandidateStore();

  const { divisionList } = useConstituencyStore();

  const [filter, setFilter] = useState({
    divisionName: "",
    districtName: "",
    constituencyName: "",
    constituencyNumber: 0,
  });

  const [tallies, setTallies] = useState<any[]>([]);
  const [winner, setWinner] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Select division, district, constituency
  const selectedDivision = divisionList.find(
    (d) => d.divisionName === filter.divisionName
  );

  const selectedDistrict = selectedDivision?.districts.find(
    (dist) => dist.districtName === filter.districtName
  );

  const selectedConstituency = selectedDistrict?.constituencies.find(
    (c) => c.constituencyNumber === Number(filter.constituencyNumber)
  );

  const fetchConstituencyTallies = async () => {
    const axiosInstance = getAxiosInstance();
    if (!filter.constituencyName || !filter.constituencyNumber) {
      toast.error("Please select constituency first!");
      return;
    }

    try {
      setLoading(true);

      const res = await axiosInstance.post("/get-constituency-tallies", {
        electionId,
        constituencyNumber: filter.constituencyNumber,
        constituencyName: filter.constituencyName,
      });

      const data = await res.data;
      toast.success(data.message);
      console.log(data.message);
      console.log(data.data);
      const tallies = data.data;

      if (tallies) {
        setTallies(data.data);
        if (tallies.length > 0) {
          // Find winner
          const maxVote = Math.max(
            ...tallies.map((c: any) => Number(c.voteCount))
          );
          const winCandidate = tallies.find(
            (c: any) => Number(c.voteCount) === maxVote
          );
          setWinner(winCandidate);
        }
      }
    } catch (error: any) {
      console.error(error);
      toast.error("Failed to fetch constituency tallies!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedConstituency) {
      setFilter((prev) => ({
        ...prev,
        constituencyName: selectedConstituency.constituencyName,
      }));
    }
  }, [filter.constituencyNumber]);

  return (
    <Container>
      {/* Header */}
      <div className="mb-6">
        <Text size={3} className="font-bold text-gray-900">
          Election ID:{" "}
          <span className="text-indigo-600 font-semibold">{electionId}</span>
        </Text>
      </div>

      {/* Filter Card */}
      <div className="bg-white shadow-md rounded-xl p-6 border border-gray-100">
        {/* Division */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-1">
            Select Division
          </label>
          <select
            className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50 transition"
            value={filter.divisionName}
            onChange={(e) =>
              setFilter({
                divisionName: e.target.value,
                districtName: "",
                constituencyName: "",
                constituencyNumber: 0,
              })
            }
          >
            <option value="">-- Choose Division --</option>
            {divisionList.map((d) => (
              <option key={d.divisionName} value={d.divisionName}>
                {d.divisionName}
              </option>
            ))}
          </select>
        </div>

        {/* District */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-1">
            Select District
          </label>
          <select
            className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50 transition disabled:bg-gray-100"
            value={filter.districtName}
            onChange={(e) =>
              setFilter({
                ...filter,
                districtName: e.target.value,
                constituencyName: "",
                constituencyNumber: 0,
              })
            }
            disabled={!selectedDivision}
          >
            <option value="">-- Choose District --</option>
            {selectedDivision?.districts.map((dist) => (
              <option key={dist.districtName} value={dist.districtName}>
                {dist.districtName}
              </option>
            ))}
          </select>
        </div>

        {/* Constituency Number */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-1">
            Select Constituency
          </label>
          <select
            className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50 transition disabled:bg-gray-100"
            value={filter.constituencyNumber}
            onChange={(e) =>
              setFilter({
                ...filter,
                constituencyNumber: Number(e.target.value),
              })
            }
            disabled={!selectedDistrict}
          >
            <option value="0">-- Choose Constituency --</option>
            {selectedDistrict?.constituencies.map((c) => (
              <option key={c.constituencyNumber} value={c.constituencyNumber}>
                {c.constituencyNumber} — {c.constituencyName}
              </option>
            ))}
          </select>
        </div>

        {/* Fetch Button */}
        <button
          className="w-full bg-indigo-600 text-white p-3 rounded-lg font-medium shadow hover:bg-indigo-700 transition disabled:bg-indigo-300"
          onClick={fetchConstituencyTallies}
          disabled={loading}
        >
          {loading ? "Loading..." : "View Result"}
        </button>
      </div>

      {/* Results */}
      {tallies.length > 0 && (
        <div className="mt-8">
          <Text size={3} className="font-bold text-gray-900 mb-4">
            Constituency Results
          </Text>

          {/* Table */}
          <div className="overflow-hidden rounded-xl shadow border border-gray-200">
            <table className="w-full text-left">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="p-3 font-semibold">Candidate</th>
                  <th className="p-3 font-semibold">Votes</th>
                </tr>
              </thead>

              <tbody className="bg-white">
                {tallies.map((t, index) => {
                  const candidateName = candidateList?.find(
                    (can) => can.candidateId === t.candidateId
                  )?.candidateName;

                  return (
                    <tr
                      key={index}
                      className="border-b hover:bg-gray-50 transition"
                    >
                      <td className="p-3">{candidateName}</td>
                      <td className="p-3 font-semibold">{t.voteCount}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Winner */}
          {winner && (
            <div className="mt-6 bg-green-50 border border-green-200 p-5 rounded-xl shadow-sm">
              <Text size={4} className="font-bold text-green-700 mb-2">
                Winner:{" "}
                {
                  candidateList?.find(
                    (can) => can.candidateId === winner.candidateId
                  )?.candidateName
                }
              </Text>
              <p className="text-green-600 font-medium">
                Total Votes: {winner.voteCount}
              </p>
            </div>
          )}
        </div>
      )}
    </Container>
  );
};

export default ViewResult;
