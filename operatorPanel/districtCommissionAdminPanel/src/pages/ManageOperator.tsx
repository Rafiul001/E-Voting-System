import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuthStore } from "../store/AuthStore";

interface Operator {
  operatorId: string;
  operatorPassword: string;
  isRevoked: boolean;
}

const ManageOperator: React.FC = () => {
  const [operators, setOperators] = useState<Operator[]>([]);
  const [loading, setLoading] = useState(false);
  const [operatorId, setOperatorId] = useState("");
  const [operatorPassword, setOperatorPassword] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10); // Number of operators per page

  const token = useAuthStore((state) => state.accessToken);
  const config = { headers: { Authorization: `Bearer ${token}` } };

  const fetchOperators = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        "http://localhost:3001/api/v1/operator/get-all",
        config
      );
      setOperators(res.data.data || []);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch operators");
    } finally {
      setLoading(false);
    }
  };

  const createOperator = async () => {
    if (!operatorId || !operatorPassword) return alert("Fill all fields");
    try {
      const res = await axios.post(
        "http://localhost:3001/api/v1/operator/create",
        { operatorId, operatorPassowrd: operatorPassword },
        config
      );
      alert(res.data.message);
      fetchOperators();
      setOperatorId("");
      setOperatorPassword("");
      setCurrentPage(1); // Reset to first page
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to create operator");
    }
  };

  const revokeOperator = async (id: string) => {
    try {
      const res = await axios.post(
        "http://localhost:3001/api/v1/operator/revoke",
        { operatorId: id },
        config
      );
      alert(res.data.message);
      fetchOperators();
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to revoke operator");
    }
  };

  useEffect(() => {
    fetchOperators();
  }, [token]);

  // Pagination logic
  const totalPages = Math.ceil(operators.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const currentOperators = operators.slice(startIndex, startIndex + pageSize);

  return (
    <div className="flex flex-col min-h-full bg-transparent text-white p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 bg-clip-text text-transparent bg-linear-to-r from-cyan-400 to-purple-600 animate-pulse">
        Manage Operators
      </h1>

      {/* Create Operator Form */}
      <div className="mb-8 flex flex-col md:flex-row gap-4 items-center">
        <input
          type="text"
          placeholder="Operator ID"
          value={operatorId}
          onChange={(e) => setOperatorId(e.target.value)}
          className="px-4 py-2 rounded-lg bg-[#111622] border border-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white"
        />
        <input
          type="password"
          placeholder="Operator Password"
          value={operatorPassword}
          onChange={(e) => setOperatorPassword(e.target.value)}
          className="px-4 py-2 rounded-lg bg-[#111622] border border-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white"
        />
        <button
          onClick={createOperator}
          className="px-6 py-2 bg-linear-to-r from-cyan-500 to-purple-600 rounded-lg hover:opacity-90 transition font-semibold"
        >
          Create
        </button>
      </div>

      {/* Operators Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-800 rounded-lg">
          <thead className="bg-[#111622]">
            <tr>
              <th className="px-4 py-2 text-left text-gray-300">Operator ID</th>
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
            ) : currentOperators.length === 0 ? (
              <tr>
                <td colSpan={3} className="text-center py-4 text-gray-400">
                  No operators found
                </td>
              </tr>
            ) : (
              currentOperators.map((op) => (
                <tr
                  key={op.operatorId}
                  className="border-b border-gray-800 hover:bg-[#1a1f2b] transition"
                >
                  <td className="px-4 py-2">{op.operatorId}</td>
                  <td className="px-4 py-2">
                    {op.isRevoked ? (
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
                    {!op.isRevoked && (
                      <button
                        onClick={() => revokeOperator(op.operatorId)}
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

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-6 space-x-4">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            className="px-4 py-2 bg-[#111622] text-white rounded-lg hover:bg-cyan-600 transition disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-gray-300">
            Page {currentPage} of {totalPages}
          </span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            className="px-4 py-2 bg-[#111622] text-white rounded-lg hover:bg-cyan-600 transition disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default ManageOperator;
