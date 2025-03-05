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
import { recruiterRegistrationUpdate } from "../Slice/RecruiterStateSlice";
import type { RootState } from "@/Slice/Store";
import { Label } from "@/components/ui/label";
import Navbar from "@/components/ui/navbar";
import RecruiterRegistrationPagination from "./RecruiterRegistrationPagination";

function RecruiterSkillsAndExperience() {
  const dispatch = useDispatch();
  interface Experience {
    id: string;
    label: string;
    type: "text",
    placeholder:string
  }
  interface InternshipExperience {
    date_of_commencement: string;
    date_of_conclusion: string;
    company: string;
    duration: string;
    roles_and_responsibilities: string;
    stipend: string;
  }
  interface CertificateCourse {
    platform_name: string;
    mentor_name: string;
    title_of_course: string;
    learning_description: string;
    date_of_commencement: string;
    date_of_conclusion: string;
  }
  interface JobExperience {
    company: string;
    designation: string;
    date_of_commencement: string;
    date_of_resignation: string;
    duration_of_service: string;
    job_description: string;
    annual_ctc: string;
  }

  const INTERNSHIP_FORM_FIELDS: Experience[] = [
    {
      id: "date_of_commencement",
      label: "Enter date of commencement",
      type: "text", placeholder:"DD/MM/YYYY  OR  MM/YYYY  OR  YYYY"

    },
    {
      id: "date_of_conclusion",
      label: "Enter date of conclusion",
      type: "text", placeholder:"DD/MM/YYYY  OR  MM/YYYY  OR  YYYY"
    },
    { id: "company", label: "Enter Company Name", type: "text", placeholder:"e.g Google or Microsoft" },
    { id: "duration", label: "Duration of Internship", type: "text", placeholder:"Enter duration in months and in numeric form only" },
    {
      id: "roles_and_responsibilities",
      label: "Mention your roles and responsibilities here",
      type: "text",
      placeholder:"e.g developing React apps"
    },
    { id: "stipend", label: "Enter stipend you received in USD", type: "text", placeholder:"Enter in USD and in numeric form only" },
  ];
  const CERTIFICATE_FORM_FIELDS: Experience[] = [
    {
      id: "platform_name",
      label: "Enter name of the platform",
      type: "text",
      placeholder:"e.g Udemy or Coursera or any workshop in your campus"
    },
    {
      id: "mentor_name",
      label: "Enter name of your mentor",
      type: "text",
      placeholder:"e.g Sandeep Jain or Kirat Singh"
    },
    {
      id: "title_of_course",
      label: "Enter course name",
      type: "text",
      placeholder:"e.g PCB designing workshop or React Tutorial"
    },
    {
      id: "learning_description",
      label: "Enter description of what you learnt",
      type: "text",
      placeholder:"Describe what you learnt"
    },
    {
      id: "date_of_commencement",
      label: "Enter Date of Commencement",
      type: "text", placeholder:"DD/MM/YYYY  OR  MM/YYYY  OR  YYYY"
    },
    {
      id: "date_of_conclusion",
      label: "Enter Date of Conclusion",
      type: "text", placeholder:"DD/MM/YYYY  OR  MM/YYYY  OR  YYYY"
    },
  ];
  const WORKEX_FORM_FIELDS: Experience[] = [
    { id: "company", label: "Enter Company you served", type: "text", placeholder:"e.g Google or Microsoft" },
    { id: "designation", label: "Enter Job Title", type: "text", placeholder:"e.g Senior React developer or Hiring Manager" },
    {
      id: "date_of_commencement",
      label: "Enter date of commencement",
      type: "text", placeholder:"DD/MM/YYYY  OR  MM/YYYY  OR  YYYY"
    },
    {
      id: "date_of_resignation",
      label: "Enter date of resignation",
      type: "text", placeholder:"DD/MM/YYYY  OR  MM/YYYY  OR  YYYY"
    },
    {
      id: "duration_of_service",
      label: "Enter duration of service",
      type: "text",
      placeholder:"enter duration in months and in numeric form only"
    },
    { id: "job_description", label: "Enter Job Description", type: "text", placeholder:"e.g Managed hiring for devops or frontend teams" },
    { id: "annual_ctc", label: "Enter Annual CTC (in USD)", type: "text", placeholder:"e.g 4000" },
  ];

  const states = useSelector((state: RootState) => ({
    internshipExperience: state.recruiterRegister.internship_experience,
    certificateCourses: state.recruiterRegister.certificate_courses,
    workExperience: state.recruiterRegister.work_experience,
    coreSkills: state.recruiterRegister.core_skills,
  }));
  const handleInternshipInputChange = (
    index: number,
    field: string,
    value: string | number
  ) => {
    const updatedInternshipExperience = [...states.internshipExperience];
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
  const handleCertificateInputChange = (
    index: number,
    field: string,
    value: string 
  ) => {
    const updatedCertificate = [...states.certificateCourses];
    updatedCertificate[index] = {
      ...updatedCertificate[index],
      [field]: value,
    };
    dispatch(
      recruiterRegistrationUpdate({
        field: "certificate_courses",
        value: updatedCertificate,
      })
    );
  };
  const handleWorkExInputChange = (
    index: number,
    field: string,
    value: string | number
  ) => {
    const updatedWorkEx = [...states.workExperience];
    updatedWorkEx[index] = {
      ...updatedWorkEx[index],
      [field]: value,
    };
    dispatch(
      recruiterRegistrationUpdate({
        field: "work_experience",
        value: updatedWorkEx,
      })
    );
  };
  const handleSkillChange = (value: string, index: number) => {
    const updatedSkills = [...states.coreSkills];
    updatedSkills[index] = value;
    dispatch(
      recruiterRegistrationUpdate({
        field: "core_skills",
        value: updatedSkills,
      })
    );
  };
  const addInternship = () => {
    const updatedInternship = [
      ...states.internshipExperience,
      {
        date_of_commencement: "",
        date_of_conclusion: "",
        company: "",
        duration: "",
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
  const addCertificate = () => {
    const updatedCertificate = [
      ...states.certificateCourses,
      {
        platform_name: "",
        mentor_name: "",
        title_of_course: "",
        learning_description: "",
        date_of_commencement: "",
        date_of_conclusion: "",
      },
    ];
    dispatch(
      recruiterRegistrationUpdate({
        field: "certificate_courses",
        value: updatedCertificate,
      })
    );
  };

  const addWorkEx = () => {
    const updatedWorkEx = [
      ...states.workExperience,
      {
        company: "",
        designation: "",
        date_of_commencement: "",
        date_of_resignation: "",
        duration_of_service: "",
        job_description: "",
        annual_ctc: "",
      },
    ];
    dispatch(
      recruiterRegistrationUpdate({
        field: "work_experience",
        value: updatedWorkEx,
      })
    );
  };
  const addSkill = () => {
    const updatedSkills = [...states.coreSkills, ""];
    dispatch(
      recruiterRegistrationUpdate({
        field: "core_skills",
        value: updatedSkills,
      })
    );
  };
  const removeInternship = (index: number) => {
    let updatedInternship;
    if (states.internshipExperience.length > 1) {
      updatedInternship = states.internshipExperience.filter(
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

  const removeCertificate = (index: number) => {
    let updatedCertificate;
    if (states.certificateCourses.length > 1) {
      updatedCertificate = states.certificateCourses.filter(
        (_: any, i: number) => i !== index
      );
      dispatch(
        recruiterRegistrationUpdate({
          field: "certificate_courses",
          value: updatedCertificate,
        })
      );
    }
  };
  const removeWorkEx = (index: number) => {
    let updatedWorkEx;
    if (states.workExperience.length > 1) {
      updatedWorkEx = states.workExperience.filter(
        (_: any, i: number) => i !== index
      );
      dispatch(
        recruiterRegistrationUpdate({
          field: "work_experience",
          value: updatedWorkEx,
        })
      );
    }
  };
  const removeSkill = (index: number) => {
    if (states.coreSkills.length > 1) {
      const updatedSkills = states.coreSkills.filter((_, i) => i !== index);
      dispatch(
        recruiterRegistrationUpdate({
          field: "core_skills",
          value: updatedSkills,
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
              {states.internshipExperience.map(
                (internship: InternshipExperience, index: number) => (
                  <Card key={index} className="space-y-4">
                    <CardContent className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h4 className="font-semibold">
                          Internship {index + 1}
                        </h4>
                        {states.internshipExperience.length > 1 && (
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
                        {INTERNSHIP_FORM_FIELDS.map(({ id, label, type,placeholder }) => (
                          <div key={id} className="space-y-2">
                            <Label htmlFor={`${id}-${index}`}>{label}</Label>
                            <Input
                              placeholder={placeholder}
                              id={`${id}-${index}`}
                              value={
                                internship[id as keyof typeof internship] ?? ""
                              }
                              type={type}
                              onChange={(e) =>
                                handleInternshipInputChange(
                                  index,
                                  id,
                                  e.target.value
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
            {/* Certificates related achievements */}
            <div className="space-y-8">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">
                  Certificate Related Achievements
                </h3>
                <Button
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                  onClick={addCertificate}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add More Certificates
                </Button>
              </div>
              {states.certificateCourses.map(
                (certificate: CertificateCourse, index: number) => (
                  <Card key={index} className="space-y-4">
                    <CardContent className="space-y-4">
                      <div className="flex-between justify-center">
                        <h4 className="font-semibold">
                          {" "}
                          Certificate {index + 1}
                        </h4>
                        {states.certificateCourses.length > 1 && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-destructive border-destructive hover:bg-destructive/90 hover:text-destructive-foreground"
                            onClick={() => removeCertificate(index)}
                          >
                            <Minus className="w-4 h-4 mr-2" />
                            Remove Certificate
                          </Button>
                        )}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {CERTIFICATE_FORM_FIELDS.map(({ id, label, type,placeholder }) => (
                          <div key={id} className="space-y-2">
                            <Label htmlFor={`${id}-${index}`}>{label}</Label>
                            <Input
                              type={type}
                              id={`${id}-${index}`}
                              onChange={(e) =>
                                handleCertificateInputChange(
                                  index,
                                  id,
                                  e.target.value
                                )
                              }
                              value={
                                certificate[id as keyof typeof certificate] ??
                                ""
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
            {/* Work Ex related forms */}
            <div className="space-y-8">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Work Experience</h3>
                <Button
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                  onClick={addWorkEx}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add more work experiences
                </Button>
              </div>
              {states.workExperience.map((workex: JobExperience, index: number) => (
                <Card key={index} className="space-y-4">
                  <CardContent className="space-y-4">
                    <div className="flex-between justify-center">
                      <h4 className="font-semibold">
                        Work Experience {index + 1}
                      </h4>
                      {states.workExperience.length > 1 && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-destructive border-destructive hover:bg-destructive/90 hover:text-destructive-foreground"
                          onClick={() => removeWorkEx(index)}
                        >
                          <Minus className="w-4 h-4 mr-2" />
                          Remove Work Ex
                        </Button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {WORKEX_FORM_FIELDS.map(({ id, label, type }) => (
                        <div key={id} className="space-y-2">
                          <Label htmlFor={`${id}-${index}`}>{label}</Label>
                          <Input
                            placeholder={label}
                            id={`${id}-${index}`}
                            type={type}
                            value={workex[id as keyof typeof workex]}
                            onChange={(e) =>
                              handleWorkExInputChange(index, id, e.target.value)
                            }
                          />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            {/* Skill based UI*/}
            <div className="space-y-8">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Skill Set</h3>
                <Button
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                  onClick={addSkill}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add More Skills
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {states.coreSkills.map((skill: string, index: number) => (
                  <Card key={index} className="p-4">
                    <div className="flex items-center space-x-2">
                      <Input
                        placeholder="Enter skill"
                        value={skill}
                        onChange={(e) =>
                          handleSkillChange(e.target.value, index)
                        }
                        className="flex-1"
                      />
                      {states.coreSkills.length > 1 && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-destructive border-destructive hover:bg-destructive/90 hover:text-destructive-foreground"
                          onClick={() => removeSkill(index)}
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <RecruiterRegistrationPagination currentPage={3} totalPages={4} />
          </CardFooter>
        </Card>
      </div>
    </>
  );
}

export default RecruiterSkillsAndExperience;