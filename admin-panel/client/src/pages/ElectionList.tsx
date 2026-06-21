import { GrView } from "react-icons/gr";
import Container from "../components/ui/Container";
import Text from "../components/ui/Text";
import { VscDebugStart } from "react-icons/vsc";
import { FaStopCircle } from "react-icons/fa";
import { useElectionStore } from "../store/electionStore";
import { useEffect, useState } from "react";
import AddElectionModal from "../components/modals/election/AddElectionModal";
import ToastModal from "../components/ToastModal";
import { useNavigate } from "react-router";

type TFormField = {
  name: string;
  label: string;
  type: string;
  placeholder?: string;
  required?: boolean;
};

const ElectionList: React.FC = () => {
  const navigate = useNavigate();

  const {
    electionList,
    setElectionList,
    addElection,
    startElection,
    finishElection,
  } = useElectionStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<{
    type: string;
    toastMessage: string;
  }>();

  const electionFields: TFormField[] = [
    {
      name: "electionName",
      label: "Election Name",
      type: "text",
      required: true,
    },
  ];

  const handleAddElection = async (data: Record<string, string>) => {
    const electionName = data.electionName?.trim();
    if (!electionName) return;

    const toast = await addElection(electionName);
    setToastMessage(toast);
  };

  useEffect(() => {
    setElectionList();
  }, [setElectionList]);

  return (
    <Container>
      <div className="flex items-center justify-between mb-6">
        <Text size={3} className="font-bold text-gray-800">
          Election List
        </Text>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg shadow hover:bg-indigo-700 transition-all"
        >
          + Add Election
        </button>
      </div>

      {/* Election Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <ul className="grid grid-cols-5 bg-gray-100 px-6 py-3 text-sm font-semibold text-gray-700">
          <li>Sl No.</li>
          <li>Election ID</li>
          <li>Election Name</li>
          <li>Status</li>
          <li className="text-center">Actions</li>
        </ul>

        {electionList && electionList.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {electionList.map((election, index) => (
              <ul
                key={index}
                className="grid grid-cols-5 items-center px-6 py-4 text-gray-700 hover:bg-gray-50 transition-all"
              >
                <li>{index + 1}</li>
                <li className="truncate">{election.electionId}</li>
                <li>{election.electionName}</li>
                <li>
                  <span
                    className={`px-3 py-1 text-xs font-medium rounded-full ${
                      election.status === "ongoing"
                        ? "bg-teal-100 text-teal-800"
                        : election.status === "finished"
                        ? "bg-rose-100 text-rose-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {election.status}
                  </span>
                </li>
                <li className="flex flex-row items-center justify-center gap-3">
                  <button
                    onClick={() =>
                      navigate(`/election-records/${election.electionId}`)
                    }
                    className="p-2 rounded-lg bg-indigo-500 text-white hover:bg-indigo-600 transition-all shadow-sm"
                    title="View Details"
                  >
                    <GrView size={18} />
                  </button>
                  <button
                    onClick={async () => {
                      const toast = await startElection(election.electionId);
                      setToastMessage(toast);
                    }}
                    className="p-2 rounded-lg bg-teal-500 text-white hover:bg-teal-600 transition-all shadow-sm"
                    title="Start Election"
                  >
                    <VscDebugStart size={18} />
                  </button>
                  <button
                    onClick={async () => {
                      const toast = await finishElection(election.electionId);
                      setToastMessage(toast);
                    }}
                    className="p-2 rounded-lg bg-rose-500 text-white hover:bg-rose-600 transition-all shadow-sm"
                    title="Finish Election"
                  >
                    <FaStopCircle size={18} />
                  </button>
                </li>
              </ul>
            ))}
          </div>
        ) : (
          <div className="py-6 text-center text-gray-500 text-sm">
            No elections found.
          </div>
        )}
      </div>

      {/* Toast Modal */}
      <ToastModal
        type={toastMessage?.type}
        toastMessage={toastMessage?.toastMessage}
        setToastMessage={setToastMessage}
      />

      {/* Add Election Modal */}
      <AddElectionModal
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        title="Add Election"
        fields={electionFields}
        onSuccess={handleAddElection}
      />
    </Container>
  );
};

export default ElectionList;
