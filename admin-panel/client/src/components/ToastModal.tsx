import Text from "./ui/Text";
import { useEffect, useState } from "react";

type TToastModal = {
  type?: string;
  toastMessage?: string;
  setToastMessage: React.Dispatch<React.SetStateAction<{type: string, toastMessage: string} | undefined>>;
};

const ToastModal: React.FC<TToastModal> = ({
  type,
  toastMessage,
  setToastMessage,
}) => {
  const [progress, setProgress] = useState(0);
  const duration = 1500; // ms

  useEffect(() => {
    if (!toastMessage) return;

    setProgress(0); // reset progress
    const start = Date.now();

    const interval = setInterval(() => {
      const elapsed = Date.now() - start;
      const percentage = Math.min((elapsed / duration) * 100, 100);
      setProgress(percentage);
    }, 50);

    const to = setTimeout(() => {
      setToastMessage(undefined);
    }, duration);

    return () => {
      clearTimeout(to);
      clearInterval(interval);
    };
  }, [toastMessage, setToastMessage]);

  return (
    <div
      className={`fixed z-50 top-16 w-full max-w-[400px] h-[130px] px-4 bg-white/80 shadow-2xl rounded-2xl transition-all duration-300 transform ${
        toastMessage
          ? "opacity-100 scale-100 right-10"
          : "opacity-0 scale-95 -right-full pointer-events-none"
      }`}
    >
      <Text
        size={4}
        className="font-semibold py-4 justify-between border-b-2 border-gray-200"
      >
        {type}
      </Text>
      <Text size={5} className="py-4">
        {toastMessage}
      </Text>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-200 rounded-b-2xl overflow-hidden">
        <div
          className="h-full bg-blue-500 transition-all duration-100 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export default ToastModal;
