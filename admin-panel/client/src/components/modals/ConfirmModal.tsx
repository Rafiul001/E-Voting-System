import { IoMdClose } from "react-icons/io";
import Flex from "../ui/Flex";
import Text from "../ui/Text";


type TConfirmModal = {
  isOpen: boolean;
  confirmMessage: string;
  onSuccess?: () => void;
  onCancel?: () => void;
};

const ConfirmModal: React.FC<TConfirmModal> = ({
  isOpen,
  confirmMessage,
  onSuccess,
  onCancel,
}) => {
  return (
    <div className="relative">
      {/* Overlay */}
      <div
        onClick={onCancel}
        className={`fixed inset-0 bg-gray-500/30 z-40 transition-opacity duration-300 ${
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      ></div>

      {/* Modal */}
      <div
        className={`fixed z-50 top-1/2 left-1/2 w-full max-w-[500px] p-4 bg-gray-50 rounded-2xl shadow transition-all duration-300 transform ${
          isOpen
            ? "opacity-100 scale-100 -translate-x-1/2 -translate-y-1/2"
            : "opacity-0 scale-95 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        }`}
      >
        <Flex className="items-center justify-between border-b-2 border-gray-200">
          <Text size={4} className="py-4 font-semibold">
            Are you sure?
          </Text>
          <div
            onClick={onCancel}
            className="p-1 text-white bg-rose-500 cursor-pointer hover:bg-rose-600 rounded-md transition-all"
          >
            <IoMdClose size={24} />
          </div>
        </Flex>

        <Text size={5} className="py-4">
          {confirmMessage}
        </Text>

        <Flex className="gap-2 justify-end">
          <button
            onClick={onCancel}
            className="text-white px-4 py-1 bg-rose-500 hover:bg-rose-600 cursor-pointer rounded-sm transition-all"
          >
            Cancel
          </button>
          <button
            onClick={onSuccess}
            className="text-white px-4 py-1 bg-teal-500 hover:bg-teal-600 cursor-pointer rounded-sm transition-all"
          >
            Delete
          </button>
        </Flex>
      </div>
    </div>
  );
};

export default ConfirmModal;
