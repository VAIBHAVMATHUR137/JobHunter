import { useState } from "react";
type WarningDialogProp = {
  title: string;
  message: string;
  yes: () => void;
  no: () => void;

};
function WarningDialog({ title, message, yes, no }: WarningDialogProp) {
  const [isOpen, setIsOpen] = useState(true);
  const handleButtonOne = () => {
    setIsOpen(false);

    no();
  };
  const handleButtonTwo = () => {
    yes();
  };
  if (!isOpen) return null;
  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white rounded-lg p-6 shadow-lg max-w-sm w-full">
          <h2 className="text-lg font-bold mb-4 text-center">{title}</h2>
          <p className="text-center">{message}</p>
          <div className="flex justify-center gap-4 mt-4">
            <button
              className="px-4 py-2 bg-primary text-primary-foreground rounded"
              onClick={handleButtonOne}
            >
              I changed my mind
            </button>
            <button
              className="px-4 py-2 bg-primary text-primary-foreground rounded"
              onClick={handleButtonTwo}
            >
              Delete it
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default WarningDialog;
