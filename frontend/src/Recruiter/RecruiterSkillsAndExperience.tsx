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

function RecruiterSkillsAndExperience() {
  const dispatch = useDispatch();
  interface Experience {
    id: string;
    label: string;
    type: "text" | "number" | "date";
  }
  const INTERNSHIP_FORM_FIELDS: Experience[] = [
    {
      id: "date_of_commencement",
      label: "Enter Date of Commencement",
      type: "date",
    },
    {
      id: "date_of_conclusion",
      label: "Enter Date of Conclusion",
      type: "date",
    },
    { id: "company", label: "Enter Company Name", type: "text" },
    { id: "duration", label: "Duration of Internship", type: "number" },
    {
      id: "roles_and_responsibilities",
      label: "Mention your roles and responsibilities here",
      type: "text",
    },
    { id: "stipend", label: "Stipend you received", type: "text" },
  ];
  const internshipExperience = useSelector((state: RootState) => ({
    internship: state.recruiterRegister.internship_experience,
  }));
  const handleInternshipInputChange = (
    index: number,
    field: string,
    value: string | number
  ) => {
    const updatedInternshipExperience = [...internshipExperience.internship];
    updatedInternshipExperience[index] = {
      ...updatedInternshipExperience[index],
      [field]: value,
    };
    dispatch(
      recruiterRegistrationUpdate({
        field: "internship_experience",
        value: updatedInternshipExperience,
      })
    );
  };
  const addInternship = () => {
    const updatedInternship = [
      ...internshipExperience.internship,
      {
        date_of_commencement: "",
        date_of_conclusion: "",
        company: "",
        duration: 0,
        roles_and_responsibilities: "",
        stipend: "",
      },
    ];
    dispatch(
      recruiterRegistrationUpdate({
        field: "internship_experience",
        value: updatedInternship,
      })
    );
  };
  const removeInternship = (index: number) => {
    let updatedInternship;
    if (internshipExperience.internship.length > 1) {
      updatedInternship = internshipExperience.internship.filter(
        (_: any, i: number) => i !== index
      );

      dispatch(
        recruiterRegistrationUpdate({
          field: "internship_experience",
          value: updatedInternship,
        })
      );
    }
  };
  return (
    <>
      <Navbar />
      <div className="flex justify-center items-center min-h-screen bg-gray-100 p-6">
        <Card className="w-full max-w-4xl shadow-lg">
          <CardHeader>
            <CardTitle className="text-center">Skills and Experience</CardTitle>
            <CardDescription className="text-center">
              Mention all your skillset and other work experience
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Internship related experience */}
            <div className="space-y-8">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Internship Experience</h3>
                <Button
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                  onClick={addInternship}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add More Internships
                </Button>
              </div>
              {internshipExperience.internship.map(
                (internship: any, index: number) => (
                  <Card key={index} className="space-y-4">
                    <CardContent className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h4 className="font-semibold">
                          Internship {index + 1}
                        </h4>
                        {internshipExperience.internship.length > 1 && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-destructive border-destructive hover:bg-destructive/90 hover:text-destructive-foreground"
                            onClick={() => removeInternship(index)}
                          >
                            <Minus className="w-4 h-4 mr-2" />
                            Remove Internship
                          </Button>
                        )}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {INTERNSHIP_FORM_FIELDS.map(({ id, label, type }) => (
                          <div key={id} className="space-y-2">
                            <Label htmlFor={`${id}-${index}`}>{label}</Label>
                            <Input
                              placeholder={`Enter ${label}`}
                              id={`${id}-${index}`}
                              value={
                                internship[id as keyof typeof internship] ?? ""
                              }
                              type={type}
                              onChange={(e) =>
                                handleInternshipInputChange(
                                  index,
                                  id,
                                  e.type === "number"
                                    ? parseFloat(e.target.value)
                                    : e.target.value
                                )
                              }
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
        </Card>
      </div>
    </>
  );
}

export default RecruiterSkillsAndExperience;
