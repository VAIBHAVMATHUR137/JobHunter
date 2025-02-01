import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button"
import { Check, ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onSubmit?: () => void;
}

const RecruiterRegistrationPagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onSubmit }) => {
  const navigate = useNavigate();

  const pages = [
    "/RecruiterPersonalInformation",
    "/RecruiterConventionalEducation",
    "/RecruiterSkillsAndExperience",
    "/RecruiterPresent"
  ];

  const goToPage = (page: number) => {
    navigate(pages[page - 1]);
  };

  const handleNextOrSubmit = () => {
    if (currentPage === totalPages && onSubmit) {
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
            <>Submit <Check className="ml-2 h-4 w-4" /></>
          ) : (
            <>Next <ChevronRight className="ml-2 h-4 w-4" /></>
          )}
        </Button>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className="bg-primary h-2.5 rounded-full transition-all duration-300 ease-in-out"
          style={{ width: `${(currentPage / totalPages) * 100}%` }}
        ></div>
      </div>
    </div>
  );
};

export default RecruiterRegistrationPagination;
