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

const RecruiterEducationForm = () => {
  const dispatch = useDispatch();
  type SchoolLevel = "tenth" | "twelth";

  interface SchoolFormField {
    id: string;
    label: string;
    type: "text" | "number" | "date";
  }

  const SCHOOL_FORM_FIELDS: SchoolFormField[] = [
    { id: "school_name", label: "School Name", type: "text" },
    { id: "school_board", label: "School Board", type: "text" },
    { id: "percentage_obtained", label: "Percentage", type: "number" },
    { id: "year_of_passing", label: "Year of Passing", type: "date" },
  ];

  const SCHOOL_LEVELS: { id: SchoolLevel; label: string }[] = [
    { id: "tenth", label: "Tenth Standard Education" },
    { id: "twelth", label: "Twelth Standard Education" },
  ];
  const educationData = useSelector((state: RootState) => ({
    tenth: state.recruiterRegister.tenth_standard_education,
    twelth: state.recruiterRegister.twelth_standard_education,
    college: state.recruiterRegister.college_education,
  }));
  const schoolEducationData = useSelector((state: RootState) => ({
    tenth: state.recruiterRegister.tenth_standard_education,
    twelth: state.recruiterRegister.twelth_standard_education,
  }));

  const handleCollegeChange = (
    index: number,
    field: string,
    value: string | number
  ) => {
    const updatedCollegeEducation = [...educationData.college];
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
      ...educationData.college,
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
    if (educationData.college.length > 1) {
      const updatedCollegeEducation = educationData.college.filter(
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
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-6">
      <Card className="w-full max-w-4xl shadow-lg">
        <CardHeader>
          <CardTitle className="text-center">Educational Background</CardTitle>
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
            {educationData.college.map((edu: any, index: number) => (
              <Card key={index} className="p-4">
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-semibold">Degree {index + 1}</h4>
                    {educationData.college.length > 1 && (
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
                    <div className="space-y-2">
                      <Label htmlFor={`programme-name-${index}`}>
                        Programme Name
                      </Label>
                      <Input
                        id={`programme-name-${index}`}
                        value={edu.programme_name}
                        onChange={(e) =>
                          handleCollegeChange(
                            index,
                            "programme_name",
                            e.target.value
                          )
                        }
                        placeholder="Enter programme name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`specialization-${index}`}>
                        Specialization
                      </Label>
                      <Input
                        id={`specialization-${index}`}
                        value={edu.specialization}
                        onChange={(e) =>
                          handleCollegeChange(
                            index,
                            "specialization",
                            e.target.value
                          )
                        }
                        placeholder="Enter specialization"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`college-name-${index}`}>
                        College Name
                      </Label>
                      <Input
                        id={`college-name-${index}`}
                        value={edu.college_name}
                        onChange={(e) =>
                          handleCollegeChange(
                            index,
                            "college_name",
                            e.target.value
                          )
                        }
                        placeholder="Enter college name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`university-name-${index}`}>
                        University Name
                      </Label>
                      <Input
                        id={`university-name-${index}`}
                        value={edu.university_name}
                        onChange={(e) =>
                          handleCollegeChange(
                            index,
                            "university_name",
                            e.target.value
                          )
                        }
                        placeholder="Enter university name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`cgpa-${index}`}>CGPA</Label>
                      <Input
                        id={`cgpa-${index}`}
                        type="number"
                        value={edu.cgpa}
                        onChange={(e) =>
                          handleCollegeChange(
                            index,
                            "cgpa",
                            parseFloat(e.target.value)
                          )
                        }
                        placeholder="Enter CGPA"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`duration-${index}`}>
                        Duration (in years)
                      </Label>
                      <Input
                        id={`duration-${index}`}
                        type="number"
                        value={edu.duration}
                        onChange={(e) =>
                          handleCollegeChange(
                            index,
                            "duration",
                            parseInt(e.target.value)
                          )
                        }
                        placeholder="Enter duration"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`year-of-commencement-${index}`}>
                        Year of Commencement
                      </Label>
                      <Input
                        type="date"
                        id={`year-of-commencement-${index}`}
                        value={edu.year_of_commencement}
                        onChange={(e) =>
                          handleCollegeChange(
                            index,
                            "year_of_commencement",
                            e.target.value
                          )
                        }
                        placeholder="Enter year of commencement"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`passout-year-${index}`}>
                        Year of Passing
                      </Label>
                      <Input
                        type="date"
                        id={`passout-year-${index}`}
                        value={edu.passout_year}
                        onChange={(e) =>
                          handleCollegeChange(
                            index,
                            "passout_year",
                            e.target.value
                          )
                        }
                        placeholder="Enter year of passing"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RecruiterEducationForm;
