import { IoMdClose } from "react-icons/io";
import Flex from "../../ui/Flex";
import Text from "../../ui/Text";
import { useCallback, useEffect, useState } from "react";

export type TFormField = {
  name: string;
  label: string;
  type: string;
  placeholder?: string;
  required?: boolean;
};

type TDynamicFormModalProps = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  title: string;
  fields: TFormField[];
  onSuccess: (data: Record<string, string>) => void | Promise<void>;
};

const AddConstituencyPartModal: React.FC<TDynamicFormModalProps> = ({
  isOpen,
  setIsOpen,
  title,
  fields,
  onSuccess,
}) => {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [inputError, setInputError] = useState<Record<string, string>>({});

  const onChangeFormData = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((state) => ({ ...state, [e.target.name]: e.target.value }));
  };

  const handleCancel = () => {
    setIsOpen(false);
  };

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      const errors: Record<string, string> = {};
      fields.forEach(({ name, label, required }) => {
        if (required && !formData[name]) {
          errors[name] = `${label} is required`;
        }
      });

      if (Object.keys(errors).length > 0) {
        setInputError(errors);
      } else {
        await onSuccess(formData);
        setIsOpen(false);
      }
    },
    [fields, formData, onSuccess, setIsOpen]
  );

  useEffect(() => {
    if (!isOpen) {
      setFormData({});
      setInputError({});
    }
  }, [isOpen]);

  return (
    <div className="relative">
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
        className={`fixed z-50 top-1/2 left-1/2 w-full max-w-[500px] p-4 bg-gray-50 rounded-2xl shadow transition-all duration-300 transform ${
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

        {/* Dynamic Form */}
        <form onSubmit={handleSubmit} className="py-2 flex flex-col gap-4">
          {fields.map(({ name, label, type, placeholder }) => (
            <Flex key={name} className="flex-col gap-2">
              <label htmlFor={name}>
                <Text size={5} className="font-semibold">
                  {label}
                </Text>
              </label>
              <input
                type={type}
                name={name}
                id={name}
                value={formData[name] ?? ""}
                placeholder={placeholder}
                onChange={onChangeFormData}
                className="border-[2px] border-indigo-300 focus:outline-indigo-500 px-2 py-1 rounded-md focus:text-indigo-700 font-medium"
              />
              {inputError[name] && (
                <Text className="text-rose-400 font-medium">
                  *{inputError[name]}
                </Text>
              )}
            </Flex>
          ))}

          <Flex className="gap-2 justify-end">
            <button
              type="button"
              onClick={handleCancel}
              className="text-white px-4 py-1 bg-rose-500 hover:bg-rose-600 cursor-pointer rounded-sm transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="text-white px-4 py-1 bg-teal-500 hover:bg-teal-600 cursor-pointer rounded-sm transition-all"
            >
              Submit
            </button>
          </Flex>
        </form>
      </div>
    </div>
  );
};

export default AddConstituencyPartModal;
