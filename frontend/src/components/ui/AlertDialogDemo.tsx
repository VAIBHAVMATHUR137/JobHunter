import { useState } from "react";

type AlertDialogDemoProps = {
  title: string;
  message: string;
  onClose: () => void;
  nextPage: () => void;
  setIsSuccess: (value: boolean) => void;
  isSuccess: boolean; // Add this prop to control button visibility
};

export function AlertDialogDemo({
  title,
  message,
  onClose,
  nextPage,
  setIsSuccess,
  isSuccess,
}: AlertDialogDemoProps) {
  const [isOpen, setIsOpen] = useState(true);

  const handleCloseButtonOne = () => {
    setIsOpen(false);

    onClose();
  };

  const handleCloseButtonTwo = () => {
    setIsSuccess(true);
    nextPage();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 shadow-lg max-w-sm w-full">
        <h2 className="text-lg font-bold mb-4 text-center">{title}</h2>
        <p className="text-center">{message}</p>
        <div className="flex justify-center gap-4 mt-4">
          <button
            className="px-4 py-2 bg-primary text-primary-foreground rounded"
            onClick={handleCloseButtonOne}
          >
            Close
          </button>
          {isSuccess && ( // Conditionally render the second button
            <button
              className="px-4 py-2 bg-primary text-primary-foreground rounded"
              onClick={handleCloseButtonTwo}
            >
              Navigate
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
