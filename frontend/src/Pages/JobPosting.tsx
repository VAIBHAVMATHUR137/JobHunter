import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/Slice/Store";
import { Plus, Minus } from "lucide-react";
import { updateJob } from "@/Slice/JobPostingSlice";
import Navbar from "@/components/ui/navbar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect } from "react";
import { recruiterDashboard } from "@/Slice/RecruiterThunk";
import axios from "axios";

function JobPosting() {
  const dispatch = useDispatch<AppDispatch>();

  const jobState = useSelector((state: RootState) => state.jobReducer);
  useEffect(() => {
    const username = localStorage.getItem("recruiterUsername");
    if (username) {
      dispatch(recruiterDashboard({ username }));
    }
  }, [dispatch]);
  const recruiterDetails = useSelector(
    (state: RootState) => state.recruiterDashboard
  );

  const addDegree = () => {
    const updatedDegree = [...jobState.degree_required, ""];
    dispatch(
      updateJob({
        field: "degree_required",
        value: updatedDegree,
      })
    );
  };
  const handleDegreeChange = (value: string, index: number) => {
    const updatedDegree = [...jobState.degree_required];
    updatedDegree[index] = value;
    dispatch(
      updateJob({
        field: "degree_required",
        value: updatedDegree,
      })
    );
  };
  const removeDegree = (index: number) => {
    if (jobState.degree_required.length > 1) {
      const updatedDegree = jobState.degree_required.filter(
        (_, i) => i !== index
      );
      dispatch(
        updateJob({
          field: "degree_required",
          value: updatedDegree,
        })
      );
    }
  };

  const addLocation = () => {
    const updatedLocation = [...jobState.job_location, ""];
    dispatch(
      updateJob({
        field: "job_location",
        value: updatedLocation,
      })
    );
  };
  const changeLocation = (value: string, index: number) => {
    const updatedLocation = [...jobState.job_location];
    updatedLocation[index] = value;
    dispatch(
      updateJob({
        field: "job_location",
        value: updatedLocation,
      })
    );
  };
  const removeLocation = (index: number) => {
    if (jobState.job_location.length > 1) {
      const updatedLocation = jobState.job_location.filter(
        (_, i) => i !== index
      );
      dispatch(
        updateJob({
          field: "job_location",
          value: updatedLocation,
        })
      );
    }
  };
  const addSkill = () => {
    const updatedSkill = [...jobState.skills_required, ""];
    dispatch(
      updateJob({
        field: "skills_required",
        value: updatedSkill,
      })
    );
  };
  const changeSkill = (value: string, index: number) => {
    const updatedSkill = [...jobState.skills_required];
    updatedSkill[index] = value;
    dispatch(
      updateJob({
        field: "skills_required",
        value: updatedSkill,
      })
    );
  };
  const removeSkill = (index: number) => {
    if (jobState.skills_required.length > 1) {
      const updatedSkill = jobState.skills_required.filter(
        (_, i) => i !== index
      );
      dispatch(
        updateJob({
          field: "skills_required",
          value: updatedSkill,
        })
      );
    }
  };
  const addLanguage = () => {
    const updatedLanguage = [...jobState.required_languages, ""];
    dispatch(
      updateJob({
        field: "required_languages",
        value: updatedLanguage,
      })
    );
  };
  const changeLanguage = (value: string, index: number) => {
    const updatedLanguage = [...jobState.required_languages];
    updatedLanguage[index] = value;
    dispatch(
      updateJob({
        field: "required_languages",
        value: updatedLanguage,
      })
    );
  };
  const removeLanguage = (index: number) => {
    if (jobState.required_languages.length > 1) {
      const updatedLanguage = jobState.required_languages.filter(
        (_, i) => i !== index
      );
      dispatch(
        updateJob({
          field: "required_languages",
          value: updatedLanguage,
        })
      );
    }
  };
  const handleSubmit = async () => {
    try {
      // Create job data object from the Redux state
      const jobData = {
        designation: jobState.designation,
        CTC: jobState.CTC,
        experience_required_in_months: jobState.experience_required_in_months,
        isFresherEligible: jobState.isFresherEligible,
        degree_required: jobState.degree_required,
        bond: jobState.bond,
        work_environment: jobState.work_environment,
        job_location: jobState.job_location,
        company_name: recruiterDetails.recruiterData.current_job.company,
        skills_required: jobState.skills_required,
        job_description: jobState.job_description,
        type_of_employment: jobState.type_of_employment,
        perks_and_benefits: jobState.perks_and_benefits,
        required_languages: jobState.required_languages,
        isVisaSponsored: jobState.isVisaSponsored,
        username: recruiterDetails.username,
        name: recruiterDetails.recruiterData.firstName,
        email: recruiterDetails.recruiterData.email,
      };

      // Correctly structure the axios request with headers as a separate config object
      const response = await axios.post(
        "http://localhost:5000/job/create",
        jobData
      );

      console.log(response.status);
      if (response.status === 201) {
        alert("Job posted successfully");
      }
    } catch (error) {
      console.error("Error posting job:", error);
      alert("Failed to post job. Please check the console for details.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto py-10 px-4">
        <Card className="max-w-3xl mx-auto shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">
              Start Recruiting
            </CardTitle>
            <CardDescription className="text-center">
              Fill in the details below to begin recruitment
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-6">
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="designation">Designation</Label>
                    <Input
                      id="designation"
                      placeholder="e.g. Senior Software Engineer"
                      value={jobState.designation}
                      onChange={(e) => {
                        dispatch(
                          updateJob({
                            field: "designation",
                            value: e.target.value,
                          })
                        );
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company_name">Company Name</Label>
                    <Input
                      id="company_name"
                      disabled
                      readOnly
                      value={recruiterDetails.recruiterData.current_job.company}
                      onChange={(e) => {
                        dispatch(
                          updateJob({
                            field: "company_name",
                            value: e.target.value,
                          })
                        );
                      }}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <fieldset className="border border-gray-200 rounded-md p-4">
                      <legend className="text-sm font-medium px-2">
                        Can Freshers Apply?
                      </legend>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <input
                            type="radio"
                            id="yes"
                            name="fresherApply"
                            value="true"
                            checked={jobState.isFresherEligible === true}
                            onChange={(event) =>
                              dispatch(
                                updateJob({
                                  field: "isFresherEligible",
                                  value: event.target.value === "true",
                                })
                              )
                            }
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                          />
                          <label
                            htmlFor="yes"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Yes
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="radio"
                            id="no"
                            name="fresherApply"
                            value="false"
                            checked={jobState.isFresherEligible === false}
                            onChange={(event) =>
                              dispatch(
                                updateJob({
                                  field: "isFresherEligible",
                                  value: event.target.value === "true",
                                })
                              )
                            }
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                          />
                          <label
                            htmlFor="no"
                            className="block text-sm font-medium text-gray-700"
                          >
                            No
                          </label>
                        </div>
                      </div>
                    </fieldset>
                  </div>
                </div>
                {/* Work Environment */}
                <div className="space-y-2">
                  <Label htmlFor="location">Work Environment</Label>
                  <Select
                    onValueChange={(value) => {
                      dispatch(
                        updateJob({
                          field: "work_environment",
                          value: value,
                        })
                      );
                    }}
                  >
                    <SelectTrigger id="work environment">
                      <SelectValue placeholder="Select work environment" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Remote">Remote</SelectItem>
                      <SelectItem value="Hybrid">Hybrid</SelectItem>
                      <SelectItem value="On-site">On-site</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="experience">Experience (years)</Label>
                    <Input
                      id="experience"
                      type="text"
                      placeholder="e.g. 3. Write only numeric form"
                      onChange={(e) => {
                        dispatch(
                          updateJob({
                            field: "experience_required_in_months",
                            value: e.target.value,
                          })
                        );
                      }}
                    />
                  </div>
                  {/* CTC Section  */}
                  <div className="space-y-2">
                    <fieldset className="border border-gray-200 rounded-md p-4">
                      <legend className="text-sm font-medium px-2">
                        CTC Band
                      </legend>
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="floorCTC">Floor CTC</Label>
                          <Input
                            id="floorCTC"
                            placeholder="e.g $80,000"
                            value={jobState.CTC.minCTC}
                            onChange={(event) => {
                              dispatch(
                                updateJob({
                                  field: "CTC",
                                  value: {
                                    minCTC: event.target.value,
                                    maxCTC: jobState.CTC.maxCTC,
                                  },
                                })
                              );
                            }}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="ceilingCTC">Ceiling CTC</Label>
                          <Input
                            id="ceilingCTC"
                            placeholder="e.g $120,000"
                            value={jobState.CTC.maxCTC}
                            onChange={(event) => {
                              dispatch(
                                updateJob({
                                  field: "CTC",
                                  value: {
                                    minCTC: jobState.CTC.minCTC,
                                    maxCTC: event.target.value,
                                  },
                                })
                              );
                            }}
                          />
                        </div>
                      </div>
                    </fieldset>
                  </div>
                </div>

                {/* Degree Section */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center mb-2">
                    <Label htmlFor="degree" className="text-sm font-medium">
                      Degree Required
                    </Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-8 text-xs"
                      onClick={addDegree}
                    >
                      <Plus className="w-3 h-3 mr-1" />
                      Add Degree
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {jobState.degree_required.map(
                      (degree: string, index: number) => (
                        <div
                          key={index}
                          className="flex items-center space-x-2 bg-gray-50 p-2 rounded-md"
                        >
                          <span className="text-xs text-gray-500 w-6 text-center">
                            {index + 1}.
                          </span>
                          <Input
                            placeholder="Enter Degree (e.g. B.Sc Computer Science)"
                            onChange={(event) =>
                              handleDegreeChange(event.target.value, index)
                            }
                            value={degree}
                            className="w-64 md:w-72 text-sm"
                          />
                          {jobState.degree_required.length > 1 && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="h-8 w-8 p-0 flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-colors"
                              onClick={() => removeDegree(index)}
                            >
                              <Minus className="w-3 h-3" />
                            </Button>
                          )}
                        </div>
                      )
                    )}
                  </div>
                </div>
                {/* Skills required for the job */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center mb-2">
                    <Label htmlFor="skills" className="text-sm font-medium">
                      Skills Required
                    </Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-8 text-xs"
                      onClick={addSkill}
                    >
                      <Plus className="w-3 h-3 mr-1" />
                      Add Skill
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {jobState.skills_required.map(
                      (skill: string, index: number) => (
                        <div
                          key={index}
                          className="flex items-center space-x-2 bg-gray-50 p-2 rounded-md"
                        >
                          <span className="text-xs text-gray-500 w-6 text-center">
                            {index + 1}.
                          </span>
                          <Input
                            placeholder="Enter Skill (e.g. React)"
                            onChange={(event) =>
                              changeSkill(event.target.value, index)
                            }
                            value={skill}
                            className="w-64 md:w-72 text-sm"
                          />
                          {jobState.skills_required.length > 1 && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="h-8 w-8 p-0 flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-colors"
                              onClick={() => removeSkill(index)}
                            >
                              <Minus className="w-3 h-3" />
                            </Button>
                          )}
                        </div>
                      )
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bond">Bond in USD</Label>
                  <Input
                    id="bond"
                    placeholder="e.g $1000 for 1 years"
                    value={jobState.bond}
                    onChange={(e) => {
                      dispatch(
                        updateJob({
                          field: "bond",
                          value: e.target.value,
                        })
                      );
                    }}
                  />
                </div>
                {/* Job Location Section */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center mb-2">
                    <Label htmlFor="location" className="text-sm font-medium">
                      Job Location
                    </Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-8 text-xs"
                      onClick={addLocation}
                    >
                      <Plus className="w-3 h-3 mr-1" />
                      Add Location
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {jobState.job_location.map(
                      (degree: string, index: number) => (
                        <div
                          key={index}
                          className="flex items-center space-x-2 bg-gray-50 p-2 rounded-md"
                        >
                          <span className="text-xs text-gray-500 w-6 text-center">
                            {index + 1}.
                          </span>
                          <Input
                            placeholder="Enter Location (e.g. Washington DC)"
                            onChange={(event) =>
                              changeLocation(event.target.value, index)
                            }
                            value={degree}
                            className="w-64 md:w-72 text-sm"
                          />
                          {jobState.job_location.length > 1 && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="h-8 w-8 p-0 flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-colors"
                              onClick={() => removeLocation(index)}
                            >
                              <Minus className="w-3 h-3" />
                            </Button>
                          )}
                        </div>
                      )
                    )}
                  </div>
                </div>
                {/* Type of employment */}
                <div className="space-y-2">
                  <Label htmlFor="location">Type of Employment</Label>
                  <Select
                    onValueChange={(value) => {
                      dispatch(
                        updateJob({
                          field: "type_of_employment",
                          value: value,
                        })
                      );
                    }}
                  >
                    <SelectTrigger id="employment type">
                      <SelectValue placeholder="Select type of employment" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Full time">Full time</SelectItem>
                      <SelectItem value="Part-time">Part time</SelectItem>
                      <SelectItem value="Contract-based">
                        Contract based
                      </SelectItem>
                      <SelectItem value="Project-based">
                        Project based
                      </SelectItem>
                      <SelectItem value="Internship">Internship</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Job Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Enter detailed job description..."
                    rows={5}
                    onChange={(e) => {
                      dispatch(
                        updateJob({
                          field: "job_description",
                          value: e.target.value,
                        })
                      );
                    }}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="requirements">Perks and Benefits</Label>
                  <Textarea
                    id="requirements"
                    placeholder="Enter job requirements..."
                    rows={3}
                    onChange={(e) => {
                      dispatch(
                        updateJob({
                          field: "perks_and_benefits",
                          value: e.target.value,
                        })
                      );
                    }}
                  />
                </div>
                {/* Required Languages */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center mb-2">
                    <Label htmlFor="language" className="text-sm font-medium">
                      Language Required
                    </Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-8 text-xs"
                      onClick={addLanguage}
                    >
                      <Plus className="w-3 h-3 mr-1" />
                      Add Language
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {jobState.required_languages.map(
                      (language: string, index: number) => (
                        <div
                          key={index}
                          className="flex items-center space-x-2 bg-gray-50 p-2 rounded-md"
                        >
                          <span className="text-xs text-gray-500 w-6 text-center">
                            {index + 1}.
                          </span>
                          <Input
                            placeholder="Enter preferred language (e.g English)"
                            onChange={(event) =>
                              changeLanguage(event.target.value, index)
                            }
                            value={language}
                            className="w-64 md:w-72 text-sm"
                          />
                          {jobState.required_languages.length > 1 && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="h-8 w-8 p-0 flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-colors"
                              onClick={() => removeLanguage(index)}
                            >
                              <Minus className="w-3 h-3" />
                            </Button>
                          )}
                        </div>
                      )
                    )}
                  </div>
                </div>
                {/* Visa Sponsorship */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <fieldset className="border border-gray-200 rounded-md p-4">
                      <legend className="text-sm font-medium px-2">
                        Company sponsoring visa for foreign nationals ?
                      </legend>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <input
                            type="radio"
                            id="yes"
                            name="visaSponsored"
                            value="true"
                            checked={jobState.isVisaSponsored === true}
                            onChange={(event) =>
                              dispatch(
                                updateJob({
                                  field: "isVisaSponsored",
                                  value: event.target.value === "true",
                                })
                              )
                            }
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                          />
                          <label
                            htmlFor="yes"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Yes
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="radio"
                            id="no"
                            name="fresherApply"
                            value="false"
                            checked={jobState.isVisaSponsored === false}
                            onChange={(event) =>
                              dispatch(
                                updateJob({
                                  field: "isVisaSponsored",
                                  value: event.target.value === "true",
                                })
                              )
                            }
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                          />
                          <label
                            htmlFor="no"
                            className="block text-sm font-medium text-gray-700"
                          >
                            No
                          </label>
                        </div>
                      </div>
                    </fieldset>
                  </div>
                </div>
                {/* Recruiter Name */}
                <div className="space-y-2">
                  <Label htmlFor="recruiter_name">
                    Full name of Recruiting officer
                  </Label>
                  <Input
                    id="recruiter_name"
                    value={recruiterDetails.recruiterData.firstName}
                    disabled
                    readOnly
                    onChange={(e) => {
                      dispatch(
                        updateJob({
                          field: "name",
                          value: e.target.value,
                        })
                      );
                    }}
                  />
                </div>
                {/* Recruiter username */}
                <div className="space-y-2">
                  <Label htmlFor="recruiter_username">Username</Label>
                  <Input
                    id="username"
                    disabled
                    readOnly
                    value={recruiterDetails.username}
                    onChange={(e) => {
                      dispatch(
                        updateJob({
                          field: "username",
                          value: e.target.value,
                        })
                      );
                    }}
                  />
                </div>
                {/* Recruiter Email Address */}
                <div className="space-y-2">
                  <Label htmlFor="recruiter_email">
                    Email Address of recruiter
                  </Label>
                  <Input
                    id="recruiter_email"
                    disabled
                    readOnly
                    value={recruiterDetails.recruiterData.email}
                    onChange={(e) => {
                      dispatch(
                        updateJob({
                          field: "email",
                          value: e.target.value,
                        })
                      );
                    }}
                  />
                </div>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline">Cancel</Button>
            <Button onClick={handleSubmit}>Create Job Posting</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

export default JobPosting;
