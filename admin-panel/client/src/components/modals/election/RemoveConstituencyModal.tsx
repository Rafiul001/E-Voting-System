import { IoMdClose } from "react-icons/io";
import Flex from "../../ui/Flex";
import Text from "../../ui/Text";
import type { TRemoveConstituencyForCandidate } from "../../../types/candidateType";
import { MdDelete } from "react-icons/md";

type TDynamicFormModalProps = {
  isOpen: boolean;
  title: string;
  onSuccess: (data: TRemoveConstituencyForCandidate) => Promise<void>;
  data:
    | {
        electionId: string;
        candidateId: string;
        constituencyList: {
          constituencyNumber: number;
          constituencyName: string;
        }[];
      }
    | undefined;
  setData: React.Dispatch<
    React.SetStateAction<
      | {
          electionId: string;
          candidateId: string;
          constituencyList: {
            constituencyNumber: number;
            constituencyName: string;
          }[];
        }
      | undefined
    >
  >;
};

const RemoveConstituencyToCandidateModal: React.FC<TDynamicFormModalProps> = ({
  isOpen,
  title,
  onSuccess,
  data,
  setData,
}) => {
  const handleCancel = () => {
    setData(undefined);
  };

  return (
    <div className="relative ">
      {/* Overlay */}
      <div
        onClick={handleCancel}
        className={`fixed inset-0 bg-gray-500/30 z-40 transition-opacity duration-300 ${
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      ></div>

      {/* Modal */}
      <div
        className={`fixed z-50 top-1/2 left-1/2 w-full max-w-[500px] max-h-full overflow-auto p-4 bg-gray-50 rounded-2xl shadow transition-all duration-300 transform ${
          isOpen
            ? "opacity-100 scale-100 -translate-x-1/2 -translate-y-1/2 pointer-events-auto"
            : "opacity-0 scale-95 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        }`}
      >
        <Flex className="items-center justify-between border-b-2 border-gray-200">
          <Text size={4} className="py-4 font-semibold">
            {title}
          </Text>
          <div
            onClick={handleCancel}
            className="p-1 text-white bg-rose-500 cursor-pointer hover:bg-rose-600 rounded-md transition-all"
          >
            <IoMdClose size={24} />
          </div>
        </Flex>

        {data &&
          data.constituencyList.length > 0 &&
          data.constituencyList.map((constituency, index) => {
            return (
              <ul key={index} className="grid grid-cols-3 items-center py-2">
                <li>{index + 1}</li>
                <li>{constituency.constituencyName}</li>
                <li className="flex flex-row items-center justify-end gap-3">
                  <button
                    onClick={async () => {
                      // Call your backend function
                      await onSuccess({
                        candidateId: data.candidateId,
                        electionId: data.electionId,
                        constituencyName: constituency.constituencyName,
                        constituencyNumber: constituency.constituencyNumber,
                      });

                      // Update the state locally
                      setData((prevData) =>
                        prevData
                          ? {
                              ...prevData,
                              constituencyList:
                                prevData.constituencyList.filter(
                                  (item) =>
                                    item.constituencyNumber !==
                                    constituency.constituencyNumber
                                ),
                            }
                          : undefined
                      );
                    }}
                    className="p-2 cursor-pointer bg-rose-500 hover:bg-rose-800 text-white rounded-3xl"
                  >
                    <MdDelete size={24} />
                  </button>
                </li>
              </ul>
            );
          })}

        {/* Buttons */}
        <Flex className="gap-2 justify-end">
          <button
            type="button"
            onClick={handleCancel}
            className="text-white px-4 py-1 bg-rose-500 hover:bg-rose-600 cursor-pointer rounded-sm transition-all"
          >
            Cancel
          </button>
        </Flex>
      </div>
    </div>
  );
};

export default RemoveConstituencyToCandidateModal;
