import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Plus, Minus } from "lucide-react";
import {
  recruiterRegistrationUpdate,
} from "../Slice/RecruiterStateSlice";
import type { RootState } from "@/Slice/Store";
import { Label } from "@/components/ui/label";
import Navbar from "@/components/ui/navbar";
import RecruiterRegistrationPagination from "./RecruiterRegistrationPagination";

const RecruiterEducationForm = () => {
  const dispatch = useDispatch();
  type SchoolLevel = "tenth" | "twelth";

  interface EducationFormField {
    id: string;
    label: string;
    type: "text"
    placeholder:string
  }


  const SCHOOL_FORM_FIELDS: EducationFormField[] = [
    { id: "school_name", label: "Enter your School Name", type: "text", placeholder:"e.g KDB Public School" },
    { id: "school_board", label: "Enter your School Board", type: "text", placeholder:"e.g CBSE/ICSE"},
    { id: "percentage_obtained", label: "Enter Percentage", type: "text", placeholder:"e.g 91.89. Do not enter % symbol" },
    { id: "year_of_passing", label: "Enter Year of Passing", type: "text", placeholder:"DD/MM/YYYY  OR  MM/YYYY  OR  YYYY" },
  ];

  const COLLEGE_FORM_FIELD: EducationFormField[] = [
    { id: "programme_name", label: "Enter Programme Name", type: "text", placeholder:"e.g Bachelor of Technology or Masters of Engineering"  },
    { id: "specialization", label: "Enter Specialization", type: "text", placeholder:"e.g Finance or Human Resources or Structural" },
    { id: "college_name", label: "Enter College Name", type: "text", placeholder:"e.g Indian Institute of Technology Delhi" },
    { id: "university_name", label: "Enter University Name", type: "text", placeholder:"e.g Anna University or Manipal University" },
    { id: "cgpa", label: "Enter CGPA you scored", type: "text", placeholder:"Enter non decimal values out of 10" },
    { id: "duration", label: "Enter the Course Duration", type: "text", placeholder:"Enter duration in months in form of numeric input only" },
    { id: "year_of_commencement", label: "Year Of Commencement", type: "text", placeholder:"DD/MM/YYYY  OR  MM/YYYY  OR  YYYY" },
    { id: "year_of_conclusion", label: "Year Of Conclusion", type: "text", placeholder:"DD/MM/YYYY  OR  MM/YYYY  OR  YYYY" },
  ];
  const SCHOOL_LEVELS: { id: SchoolLevel; label: string }[] = [
    { id: "tenth", label: "Tenth Standard Education" },
    { id: "twelth", label: "Twelth Standard Education" },
  ];

  const schoolEducationData = useSelector((state: RootState) => ({
    tenth: state.recruiterRegister.tenth_standard_education,
    twelth: state.recruiterRegister.twelth_standard_education,
  }));
  const collegeEducationData = useSelector((state: RootState) => ({
    college: state.recruiterRegister.college_education,
  }));

  const handleCollegeChange = (index: number, field: string, value: string) => {
    const updatedCollegeEducation = [...collegeEducationData.college];
    updatedCollegeEducation[index] = {
      ...updatedCollegeEducation[index],
      [field]: value,
    };

    dispatch(
      recruiterRegistrationUpdate({
        field: "college_education",
        value: updatedCollegeEducation,
      })
    );
  };

  const addCollegeEducation = () => {
    const updatedCollegeEducation = [
      ...collegeEducationData.college,
      {
        programme_name: "",
        specialization: "",
        college_name: "",
        university_name: "",
        cgpa: "",
        duration: "",
        year_of_commencement: "",
        year_of_conclusion: "",
      },
    ];

    dispatch(
      recruiterRegistrationUpdate({
        field: "college_education",
        value: updatedCollegeEducation,
      })
    );
  };

  const removeCollegeEducation = (index: number) => {
    if (collegeEducationData.college.length > 1) {
      const updatedCollegeEducation = collegeEducationData.college.filter(
        (_: college_education, i: number) => i !== index
      );
      dispatch(
        recruiterRegistrationUpdate({
          field: "college_education",
          value: updatedCollegeEducation,
        })
      );
    }
  };

  const handleInputChange = (
    level: SchoolLevel,
    fieldId: string,
    value: string | number
  ) => {
    const standardKey = `${level}_standard_education` as const;
    dispatch(
      recruiterRegistrationUpdate({
        field: standardKey,
        value: {
          ...schoolEducationData[level],
          [fieldId]: value,
        },
      })
    );
  };
  interface college_education {
    programme_name: string;
    specialization: string;
    college_name: string;
    university_name: string;
    cgpa: string;
    duration: string;
    year_of_commencement: string;
    year_of_conclusion: string;
  }

  return (
    <>
      <Navbar />
      <div className="flex justify-center items-center min-h-screen bg-gray-100 p-6">
        <Card className="w-full max-w-4xl shadow-lg">
          <CardHeader>
            <CardTitle className="text-center">
              Educational Background
            </CardTitle>
            <CardDescription className="text-center">
              Please provide your educational details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Complete school education */}
            <div className="space-y-8">
              {SCHOOL_LEVELS.map(({ id: level, label }) => (
                <div key={level} className="space-y-4">
                  <h3 className="text-lg font-semibold">{label}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {SCHOOL_FORM_FIELDS.map(({ id, label, type,placeholder }) => (
                      <div key={`${level}-${id}`} className="space-y-2">
                        <Label htmlFor={`${level}-${id}`}>{label}</Label>
                        <Input
                          id={`${level}-${id}`}
                          name={`${level}-${id}`}
                          type={type}
                          value={
                            schoolEducationData[level][
                              id as keyof (typeof schoolEducationData)[typeof level]
                            ] || ""
                          }
                          placeholder={placeholder}
                          onChange={(e) =>
                            handleInputChange(
                              level,
                              id,

                              e.target.value
                            )
                          }
                          className="w-full"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* College Education */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">College Education</h3>
                <Button
                  onClick={addCollegeEducation}
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Degree
                </Button>
              </div>
              {collegeEducationData.college.map(
                (edu: college_education, index: number) => (
                  <Card key={index} className="p-4">
                    <CardContent className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h4 className="font-semibold">Degree {index + 1}</h4>
                        {collegeEducationData.college.length > 1 && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeCollegeEducation(index)}
                            className="text-destructive border-destructive hover:bg-destructive/90 hover:text-destructive-foreground"
                          >
                            <Minus className="w-4 h-4 mr-2" />
                            Remove
                          </Button>
                        )}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {COLLEGE_FORM_FIELD.map(({ id, label, type,placeholder }) => (
                          <div key={id} className="space-y-2">
                            <Label htmlFor={`${id}-${index}`}>{label}</Label>
                            <Input
                              id={`${id}-${index}`}
                              type={type}
                              value={edu[id as keyof typeof edu] ?? ""}
                              onChange={(e) =>
                                handleCollegeChange(index, id, e.target.value)
                              }
                              placeholder={placeholder}
                            />
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )
              )}
            </div>
          </CardContent>

          <CardFooter>
            <RecruiterRegistrationPagination currentPage={2} totalPages={4} />
          </CardFooter>
        </Card>
      </div>
    </>
  );
};

export default RecruiterEducationForm;