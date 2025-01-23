import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Plus, Minus } from "lucide-react";
import { recruiterRegistrationUpdate } from "../Slice/RecruiterSlice";
import { RootState } from "@/Slice/Store";
import { Label } from "@/components/ui/label";
import Navbar from "@/components/ui/navbar";

const RecruiterEducationForm = () => {
  const dispatch = useDispatch();
  type SchoolLevel = "tenth" | "twelth";

  interface EducationFormField {
    id: string;
    label: string;
    type: "text" | "number" | "date";
  }

  const SCHOOL_FORM_FIELDS: EducationFormField[] = [
    { id: "school_name", label: "School Name", type: "text" },
    { id: "school_board", label: "School Board", type: "text" },
    { id: "percentage_obtained", label: "Percentage", type: "number" },
    { id: "year_of_passing", label: "Year of Passing", type: "date" },
  ];

  const COLLEGE_FORM_FIELD: EducationFormField[] = [
    { id: "programme_name", label: "Programme Name", type: "text" },
    { id: "specialization", label: "Specialization", type: "text" },
    { id: "college_name", label: "College Name", type: "text" },
    { id: "university_name", label: "University Name", type: "text" },
    { id: "cgpa", label: "CGPA", type: "number" },
    { id: "duration", label: "Duration", type: "number" },
    { id: "year_of_commencement", label: "Year Of Commencement", type: "date" },
    { id: "year_of_passing", label: "Year Of Passing", type: "date" },
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

  const handleCollegeChange = (
    index: number,
    field: string,
    value: string | number
  ) => {
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

  const getFieldLabel = (field: string): string =>
    field
      .split(/(?=[A-Z])|_/)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join("");

  const addCollegeEducation = () => {
    const updatedCollegeEducation = [
      ...collegeEducationData.college,
      {
        programme_name: "",
        specialization: "",
        college_name: "",
        university_name: "",
        cgpa: 0,
        duration: 0,
        year_of_commencement: "",
        passout_year: "",
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
        (_: any, i: number) => i !== index
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
                    {SCHOOL_FORM_FIELDS.map(({ id, label, type }) => (
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
                          placeholder={`Enter your ${getFieldLabel(label)}`}
                          onChange={(e) =>
                            handleInputChange(
                              level,
                              id,

                              type === "number"
                                ? parseFloat(e.target.value)
                                : e.target.value
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
              {collegeEducationData.college.map((edu: any, index: number) => (
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
                      {COLLEGE_FORM_FIELD.map(({ id, label, type }) => (
                        <div key={id} className="space-y-2">
                          <Label htmlFor={`${id}-${index}`}>{label}</Label>
                          <Input
                            id={`${id}-${index}`}
                            type={type}
                            value={edu[id as keyof typeof edu]||""}
                            onChange={(e) =>
                              handleCollegeChange(index, id, 
                                type === 'number' ? parseFloat(e.target.value) : e.target.value
                              )
                            }
                            placeholder={`Enter your ${getFieldLabel(label)}`}
                          />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default RecruiterEducationForm;
