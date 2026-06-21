import { useNavigate, useParams } from "react-router";
import Container from "../components/ui/Container";
import Text from "../components/ui/Text";
import { useCandidateStore } from "../store/candidateStore";
import { useCallback, useEffect, useState } from "react";
import ToastModal from "../components/ToastModal";
import AddCandidateModal from "../components/modals/election/AddCandidateModal";
import type {
  TAddConstituencyForCandidate,
  TCreateCandidate,
  TRemoveConstituencyForCandidate,
} from "../types/candidateType";
import { MdDelete } from "react-icons/md";
import { IoMdAdd, IoMdRemoveCircleOutline } from "react-icons/io";
import AddConstituencyToCandidateModal from "../components/modals/election/AddConstituencyToCandidateModal";
import RemoveConstituencyToCandidateModal from "../components/modals/election/RemoveConstituencyModal";
import DeleteModal from "../components/modals/DeleteModal";
import Flex from "../components/ui/Flex";

const ViewElection = () => {
  const { electionId } = useParams();
  const navigate = useNavigate();

  const {
    candidateList,
    createCandidate,
    setCandidateListByElectionId,
    addConstituency,
    removeConstituency,
    deleteCandidate,
  } = useCandidateStore();

  const [toastMessage, setToastMessage] = useState<{
    type: string;
    toastMessage: string;
  }>();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [selectedAddConstituencyData, setSelectedAddConstituencyData] =
    useState<{
      candidateId: string;
      electionId: string;
    }>();

  const [selectedRemoveConstituencyData, setSelectedRemoveConstituencyData] =
    useState<{
      candidateId: string;
      electionId: string;
      constituencyList: {
        constituencyNumber: number;
        constituencyName: string;
      }[];
    }>();

  // Delete modal state
  const [deleteFunction, setDeleteFunction] = useState<() => Promise<void>>();

  const handleAddCandidate = useCallback(
    async (newCandidate: TCreateCandidate) => {
      const toast = await createCandidate(newCandidate);
      setToastMessage(toast);
    },
    [createCandidate]
  );

  const handleAddConstituency = useCallback(
    async (newConstituency: TAddConstituencyForCandidate) => {
      const toast = await addConstituency(newConstituency);
      setToastMessage(toast);
    },
    [addConstituency]
  );

  const handleDeleteConstituency = useCallback(
    async (constituency: TRemoveConstituencyForCandidate) => {
      const toast = await removeConstituency(constituency);
      setToastMessage(toast);
    },
    [removeConstituency]
  );

  useEffect(() => {
    if (!electionId) return;

    (async () => {
      await setCandidateListByElectionId(electionId);
    })();
  }, [electionId, setCandidateListByElectionId]);

  return (
    <Container className="relative">
      <div className="flex items-center justify-between mb-6">
        <Text size={3} className="font-bold text-gray-800">
          Election ID: <span className="text-indigo-600">{electionId}</span>
        </Text>
        <Flex className="gap-2">
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg shadow hover:bg-indigo-700 transition-all"
          >
            + Add Candidate
          </button>

          <button
            onClick={() =>
              navigate(`/election-records/${electionId}/view-result`)
            }
            className="px-4 py-2 bg-teal-600 text-white font-medium rounded-lg shadow hover:bg-teal-700 transition-all"
          >
            View Result
          </button>
        </Flex>
      </div>

      {/* Candidate Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <ul className="grid grid-cols-[10%_50%_10%_10%_10%_10%] bg-gray-100 px-6 py-3 text-sm font-semibold text-gray-700">
          <li>Sl No.</li>
          <li>Candidate ID</li>
          <li>Candidate Name</li>
          <li>Voter ID</li>
          <li className="text-center">Constituencies</li>
          <li className="text-center">Actions</li>
        </ul>

        {candidateList && candidateList.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {candidateList.map((candidate, index) => (
              <ul
                key={index}
                className="grid grid-cols-[10%_50%_10%_10%_10%_10%] items-center px-6 py-4 text-gray-700 hover:bg-gray-50 transition-all"
              >
                <li>{index + 1}</li>
                <li className="truncate">{candidate.candidateId}</li>
                <li>{candidate.candidateName}</li>
                <li>{candidate.voterId}</li>
                <li className="flex flex-wrap justify-center gap-2">
                  {candidate.constituency.map((con, idx) => (
                    <span
                      key={idx}
                      className="bg-indigo-100 text-indigo-700 px-3 py-1 text-xs rounded-full"
                    >
                      {con.constituencyName}
                    </span>
                  ))}
                </li>
                <li className="flex justify-center gap-3">
                  <button
                    onClick={() => {
                      setSelectedAddConstituencyData({
                        candidateId: candidate.candidateId,
                        electionId: candidate.electionId,
                      });
                    }}
                    className="p-2 rounded-lg bg-indigo-500 text-white hover:bg-indigo-600 transition-all shadow-sm"
                    title="Add Constituency"
                  >
                    <IoMdAdd size={22} />
                  </button>

                  <button
                    onClick={() => {
                      setSelectedRemoveConstituencyData({
                        candidateId: candidate.candidateId,
                        electionId: candidate.electionId,
                        constituencyList: candidate.constituency,
                      });
                    }}
                    className="p-2 rounded-lg bg-yellow-500 text-white hover:bg-yellow-600 transition-all shadow-sm"
                    title="Remove Constituency"
                  >
                    <IoMdRemoveCircleOutline size={22} />
                  </button>

                  <button
                    onClick={() => {
                      setDeleteFunction(() => async () => {
                        const toast = await deleteCandidate(
                          candidate.candidateId,
                          candidate.electionId
                        );
                        setToastMessage(toast);
                      });
                    }}
                    className="p-2 rounded-lg bg-rose-500 text-white hover:bg-rose-600 transition-all shadow-sm"
                    title="Delete Candidate"
                  >
                    <MdDelete size={22} />
                  </button>
                </li>
              </ul>
            ))}
          </div>
        ) : (
          <div className="py-6 text-center text-gray-500 text-sm">
            No candidates found for this election.
          </div>
        )}
      </div>

      {/* Modals */}
      <RemoveConstituencyToCandidateModal
        data={selectedRemoveConstituencyData}
        isOpen={!!selectedRemoveConstituencyData}
        onSuccess={handleDeleteConstituency}
        title="Delete Constituency"
        setData={setSelectedRemoveConstituencyData}
      />

      <AddConstituencyToCandidateModal
        data={selectedAddConstituencyData}
        isOpen={!!selectedAddConstituencyData}
        setData={setSelectedAddConstituencyData}
        title="Add Constituency"
        onSuccess={handleAddConstituency}
      />

      <AddCandidateModal
        electionId={electionId ?? ""}
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        title="Add Candidate"
        onSuccess={handleAddCandidate}
      />

      <DeleteModal
        isOpen={!!deleteFunction}
        confirmMessage="Do you want to delete this candidate?"
        onCancel={() => setDeleteFunction(undefined)}
        onDelete={async () => {
          if (deleteFunction) {
            await deleteFunction();
            setDeleteFunction(undefined);
          }
        }}
      />

      <ToastModal
        type={toastMessage?.type}
        toastMessage={toastMessage?.toastMessage}
        setToastMessage={setToastMessage}
      />
    </Container>
  );
};

export default ViewElection;
