import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuthStore } from "../store/AuthStore";

type TUnion = {
  unionName: string;
  wards: number[];
};

type TUpazila = {
  upazilaName: string;
  unions: TUnion[];
};

type TCityCorporation = {
  cityCorporationName: string;
  wards: number[];
};

type TConstituency = {
  constituencyNumber: number;
  constituencyName: string;
  boundaries: {
    upazilas?: TUpazila[];
    cityCorporations?: TCityCorporation[];
  };
};

type TDistrict = {
  districtName: string;
  constituencies: TConstituency[];
};

interface IConstituencyModel {
  _id: string;
  divisionName: string;
  districts: TDistrict[];
}

interface Machine {
  machineId: string;
  machinePassword: string;
  isRevoked: boolean;
  constituencyName: string;
  constituencyNumber: string;
}

const ManageMachine: React.FC = () => {
  const [machines, setMachines] = useState<Machine[]>([]);
  const [loading, setLoading] = useState(false);

  // Machine fields
  const [machineId, setMachineId] = useState("");
  const [machinePassword, setMachinePassword] = useState("");

  // location fields
  const [divisionName, setDivisionName] = useState("");
  const [districtName, setDistrictName] = useState("");
  const [constituencyNumber, setConstituencyNumber] = useState<number>(0);

  const [constituencyList, setConstituencyList] = useState<
    IConstituencyModel[]
  >([]);
  const selectedDivision = constituencyList.find(
    (d) => d.divisionName === divisionName
  );
  const selectedDistrict = selectedDivision?.districts.find(
    (dist) => dist.districtName === districtName
  );

  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);

  const token = useAuthStore((state) => state.accessToken);
  const config = { headers: { Authorization: `Bearer ${token}` } };

  const fetchConstituencyList = async () => {
    try {
      const res = await axios.get(
        "http://localhost:3001/api/v1/constituency/get-all",
        config
      );
      const responseData = await res.data;
      console.log(responseData.data);
      setConstituencyList(responseData.data);
    } catch (error) {
      console.log(error);
    }
  };

  // Fetch machines
  const fetchMachines = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        "http://localhost:3001/api/v1/machine/get-all",
        config
      );
      setMachines(res.data.data || []);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch machines");
    } finally {
      setLoading(false);
    }
  };

  // Create machine
  const createMachine = async () => {
    if (
      !machineId ||
      !machinePassword ||
      !divisionName ||
      !districtName ||
      !constituencyNumber
    ) {
      return alert("Please fill all fields");
    }

    const constituencyObj = selectedDistrict?.constituencies.find(
      (c) => c.constituencyNumber === constituencyNumber
    );

    try {
      const res = await axios.post(
        "http://localhost:3001/api/v1/machine/create",
        {
          machineId,
          machinePassowrd: machinePassword,
          divisionName,
          districtName,
          constituencyNumber,
          constituencyName: constituencyObj?.constituencyName || "",
        },
        config
      );

      alert(res.data.message);
      fetchMachines();

      // Clear fields
      setMachineId("");
      setMachinePassword("");
      setDivisionName("");
      setDistrictName("");
      setConstituencyNumber(0);

      setCurrentPage(1);
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to create machine");
    }
  };

  const revokeMachine = async (id: string) => {
    try {
      const res = await axios.post(
        "http://localhost:3001/api/v1/machine/revoke",
        { machineId: id },
        config
      );
      alert(res.data.message);
      fetchMachines();
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to revoke machine");
    }
  };

  useEffect(() => {
    fetchMachines();
  }, [token]);

  useEffect(() => {
    fetchConstituencyList();
  }, []);

  // pagination
  const totalPages = Math.ceil(machines.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const currentMachines = machines.slice(startIndex, startIndex + pageSize);

  return (
    <div className="flex flex-col min-h-full bg-transparent text-white p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 bg-clip-text text-transparent bg-linear-to-r from-cyan-400 to-purple-600 animate-pulse">
        Manage Machines
      </h1>

      {/* CREATE MACHINE FORM */}
      <div className="mb-8 flex flex-col gap-4">
        {/* Machine ID */}
        <input
          type="text"
          placeholder="Machine ID"
          value={machineId}
          onChange={(e) => setMachineId(e.target.value)}
          className="px-4 py-2 rounded-lg bg-[#111622] border border-gray-700"
        />

        {/* Password */}
        <input
          type="password"
          placeholder="Machine Password"
          value={machinePassword}
          onChange={(e) => setMachinePassword(e.target.value)}
          className="px-4 py-2 rounded-lg bg-[#111622] border border-gray-700"
        />

        {/* Division */}
        <div className="flex flex-col gap-2">
          <label>Division</label>
          <select
            value={divisionName}
            onChange={(e) => {
              setDivisionName(e.target.value);
              setDistrictName("");
              setConstituencyNumber(0);
            }}
            className="px-2 py-2 bg-[#111622] border border-gray-700 rounded-md"
          >
            <option value="">Select Division</option>
            {constituencyList.map((d) => (
              <option key={d.divisionName} value={d.divisionName}>
                {d.divisionName}
              </option>
            ))}
          </select>
        </div>

        {/* District */}
        {selectedDivision && (
          <div className="flex flex-col gap-2">
            <label>District</label>
            <select
              value={districtName}
              onChange={(e) => {
                setDistrictName(e.target.value);
                setConstituencyNumber(0);
              }}
              className="px-2 py-2 bg-[#111622] border border-gray-700 rounded-md"
            >
              <option value="">Select District</option>
              {selectedDivision.districts.map((dist) => (
                <option key={dist.districtName} value={dist.districtName}>
                  {dist.districtName}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Constituency */}
        {selectedDistrict && (
          <div className="flex flex-col gap-2">
            <label>Constituency</label>
            <select
              value={constituencyNumber}
              onChange={(e) => setConstituencyNumber(Number(e.target.value))}
              className="px-2 py-2 bg-[#111622] border border-gray-700 rounded-md"
            >
              <option value="">Select Constituency</option>
              {selectedDistrict.constituencies.map((c) => (
                <option key={c.constituencyNumber} value={c.constituencyNumber}>
                  {c.constituencyNumber} - {c.constituencyName}
                </option>
              ))}
            </select>
          </div>
        )}

        <button
          onClick={createMachine}
          className="px-6 py-2 bg-linear-to-r from-cyan-500 to-purple-600 rounded-lg font-semibold"
        >
          Create
        </button>
      </div>

      {/* MACHINE TABLE (ORIGINAL TABLE YOU SENT) */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-800 rounded-lg">
          <thead className="bg-[#111622]">
            <tr>
              <th className="px-4 py-2 text-left text-gray-300">Machine ID</th>
              <th className="px-4 py-2 text-left text-gray-300">Status</th>
              <th className="px-4 py-2 text-left text-gray-300">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={3} className="text-center py-4 text-gray-400">
                  Loading...
                </td>
              </tr>
            ) : currentMachines.length === 0 ? (
              <tr>
                <td colSpan={3} className="text-center py-4 text-gray-400">
                  No machines found
                </td>
              </tr>
            ) : (
              currentMachines.map((machine) => (
                <tr
                  key={machine.machineId}
                  className="border-b border-gray-800 hover:bg-[#1a1f2b] transition"
                >
                  <td className="px-4 py-2">{machine.machineId}</td>
                  <td className="px-4 py-2">
                    {machine.isRevoked ? (
                      <span className="text-red-500 font-semibold">
                        Revoked
                      </span>
                    ) : (
                      <span className="text-green-400 font-semibold">
                        Active
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-2 space-x-2">
                    {!machine.isRevoked && (
                      <button
                        onClick={() => revokeMachine(machine.machineId)}
                        className="px-3 py-1 bg-red-600 rounded-md hover:bg-red-700 transition"
                      >
                        Revoke
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-6 space-x-4">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            className="px-4 py-2 bg-[#111622] rounded-lg disabled:opacity-50"
          >
            Previous
          </button>

          <span className="text-gray-300">
            Page {currentPage} of {totalPages}
          </span>

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            className="px-4 py-2 bg-[#111622] rounded-lg disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default ManageMachine;
