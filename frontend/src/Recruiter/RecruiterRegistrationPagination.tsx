import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Check, ChevronLeft, ChevronRight } from "lucide-react";
import { RootState } from "@/Slice/Store";
import { useState } from "react";
import { useSelector } from "react-redux";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  validatePersonalInfo,
  validateEducation,
  validateSkillsAndExperience,
  validatePresentJob,
} from "./RecruiterFormValidator";
import { AlertDialogDemo } from "@/components/ui/AlertDialogDemo";
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onSubmit?: () => void;
}

const RecruiterRegistrationPagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onSubmit,
}) => {
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [title, setTitle] = useState<string | "">("");
  const [message, setMessage] = useState<string | " ">("");
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const navigate = useNavigate();
  const formData = useSelector((state: RootState) => state.recruiterRegister);
  const nav = useNavigate();
  const putTitle = (heading: string) => setTitle(heading);
  const putMessage = (message: string) => setMessage(message);
  const pages = [
    "/RecruiterPersonalInformation",
    "/RecruiterConventionalEducation",
    "/RecruiterSkillsAndExperience",
    "/RecruiterPresent",
  ];
  const validateCurrentPage = (): boolean => {
    let validationResult;

    switch (currentPage) {
      case 1:
        validationResult = validatePersonalInfo(formData);
        break;
      case 2:
        validationResult = validateEducation(formData);
        break;
      case 3:
        validationResult = validateSkillsAndExperience(formData);
        break;
      case 4:
        validationResult = validatePresentJob(formData);
        break;
      default:
        return true;
    }

    if (!validationResult.isValid) {
      const errorMessages = Object.values(validationResult.errors).flat();

      setShowAlert(true);
      putTitle("Data Missing");
      putMessage(errorMessages[0]);
      setIsSuccess(false);
      return false;
    }

    return true;
  };

  const goToPage = (page: number) => {
    if (page > currentPage) {
      // Only validate when moving forward
      if (!validateCurrentPage()) {
        return;
      }
    }

    navigate(pages[page - 1]);
  };

  const handleNextOrSubmit = () => {
    if (!validateCurrentPage()) {
      return;
    }

    if (currentPage === totalPages && onSubmit) {
      // Validate all pages before final submission
      const validations = [
        validatePersonalInfo(formData),
        validateEducation(formData),
        validateSkillsAndExperience(formData),
        validatePresentJob(formData),
      ];

      const isValid = validations.every((v) => v.isValid);
      if (!isValid) {
        setShowAlert(true);
        putTitle("Data Missing");
        putMessage("Complete all fields before submission");
        setIsSuccess(false);
        return;
      }

      onSubmit();
    } else {
      goToPage(currentPage + 1);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4 w-full">
      <div className="flex justify-between items-center w-full">
        <Button
          variant="outline"
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
          className="flex items-center"
        >
          <ChevronLeft className="mr-2 h-4 w-4" /> Previous
        </Button>
        <div className="flex space-x-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Button
              key={page}
              variant={page === currentPage ? "default" : "outline"}
              onClick={() => goToPage(page)}
              className="w-10 h-10 rounded-full"
            >
              {page}
            </Button>
          ))}
        </div>
        <Button
          onClick={handleNextOrSubmit}
          disabled={currentPage === totalPages && !onSubmit}
          className="flex items-center"
        >
          {currentPage === totalPages ? (
            <>
              Submit <Check className="ml-2 h-4 w-4" />
            </>
          ) : (
            <>
              Next <ChevronRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className="bg-primary h-2.5 rounded-full transition-all duration-300 ease-in-out"
          style={{ width: `${(currentPage / totalPages) * 100}%` }}
        ></div>
      </div>
      {showAlert && (
        <AlertDialogDemo
          title={title}
          message={message}
          onClose={() => setShowAlert(false)}
          nextPage={() => nav("/RecruiterLogin")}
          setIsSuccess={setIsSuccess}
          isSuccess={isSuccess}
        />
      )}
    </div>
  );
};

export default RecruiterRegistrationPagination;
