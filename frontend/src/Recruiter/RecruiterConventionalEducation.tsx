import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Plus, Minus, GraduationCap, School } from 'lucide-react';
import { recruiterRegistrationUpdate } from "../Slice/RecruiterSlice"
import { RootState } from '@/Slice/Store';
import Navbar from '@/components/ui/navbar';

const RecruiterEducationForm = () => {
  const dispatch = useDispatch();
  const educationData = useSelector((state: RootState) => ({
    tenth: state.recruiterRegister.tenth_standard_education,
    twelth: state.recruiterRegister.twelth_standard_education,
    college: state.recruiterRegister.college_education
  }));

  const handleSchoolChange = (level: 'tenth' | 'twelth', field: string, value: string | number) => {
    dispatch(recruiterRegistrationUpdate({
      field: `${level}_standard_education`,
      value: {
        ...educationData[level],
        [field]: value
      }
    }));
  };

  const handleCollegeChange = (index: number, field: string, value: string | number) => {
    const updatedCollegeEducation = [...educationData.college];
    updatedCollegeEducation[index] = {
      ...updatedCollegeEducation[index],
      [field]: value
    };
    
    dispatch(recruiterRegistrationUpdate({
      field: 'college_education',
      value: updatedCollegeEducation
    }));
  };

  const addCollegeEducation = () => {
    const updatedCollegeEducation = [...educationData.college, {
      programme_name: "",
      specialization: "",
      college_name: "",
      university_name: "",
      cgpa: 0,
      duration: 0,
      year_of_commencement: "",
      passout_year: ""
    }];
    
    dispatch(recruiterRegistrationUpdate({
      field: 'college_education',
      value: updatedCollegeEducation
    }));
  };

  const removeCollegeEducation = (index: number) => {
    if (educationData.college.length > 1) {
      const updatedCollegeEducation = educationData.college.filter((_: any, i: number) => i !== index);
      dispatch(recruiterRegistrationUpdate({
        field: 'college_education',
        value: updatedCollegeEducation
      }));
    }
  };

  return (
    <>
    <Navbar/>
    <div className="max-w-4xl mx-auto space-y-8 p-6 bg-gray-50 rounded-xl shadow-lg">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">Educational Background</h1>
      
      {/* 10th Standard Education */}
      <Card className="border-t-4 border-blue-500">
        <CardHeader className="bg-gray-100">
          <CardTitle className="flex items-center text-xl text-blue-700">
            <School className="mr-2" />
            10th Standard Education
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6">
          <Input
            placeholder="School Name"
            value={educationData.tenth.school_name}
            onChange={(e) => handleSchoolChange('tenth', 'school_name', e.target.value)}
            className="border-gray-300"
          />
          <Input
            type="number"
            placeholder="Percentage Obtained"
            value={educationData.tenth.percentage_obtained}
            onChange={(e) => handleSchoolChange('tenth', 'percentage_obtained', parseFloat(e.target.value))}
            className="border-gray-300"
          />
          <Input
            placeholder="Year of Passing"
            value={educationData.tenth.year_of_passing}
            onChange={(e) => handleSchoolChange('tenth', 'year_of_passing', e.target.value)}
            className="border-gray-300"
          />
          <Input
            placeholder="School Board"
            value={educationData.tenth.school_board}
            onChange={(e) => handleSchoolChange('tenth', 'school_board', e.target.value)}
            className="border-gray-300"
          />
        </CardContent>
      </Card>

      {/* 12th Standard Education */}
      <Card className="border-t-4 border-green-500">
        <CardHeader className="bg-gray-100">
          <CardTitle className="flex items-center text-xl text-green-700">
            <School className="mr-2" />
            12th Standard Education
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6">
          <Input
            placeholder="School Name"
            value={educationData.twelth.school_name}
            onChange={(e) => handleSchoolChange('twelth', 'school_name', e.target.value)}
            className="border-gray-300"
          />
          <Input
            type="number"
            placeholder="Percentage Obtained"
            value={educationData.twelth.percentage_obtained}
            onChange={(e) => handleSchoolChange('twelth', 'percentage_obtained', parseFloat(e.target.value))}
            className="border-gray-300"
          />
          <Input
            placeholder="Year of Passing"
            value={educationData.twelth.year_of_passing}
            onChange={(e) => handleSchoolChange('twelth', 'year_of_passing', e.target.value)}
            className="border-gray-300"
          />
          <Input
            placeholder="School Board"
            value={educationData.twelth.school_board}
            onChange={(e) => handleSchoolChange('twelth', 'school_board', e.target.value)}
            className="border-gray-300"
          />
        </CardContent>
      </Card>

      {/* College Education */}
      <Card className="border-t-4 border-purple-500">
        <CardHeader className="bg-gray-100 flex flex-row items-center justify-between">
          <CardTitle className="flex items-center text-xl text-purple-700">
            <GraduationCap className="mr-2" />
            College Education
          </CardTitle>
          <Button 
            onClick={addCollegeEducation}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Degree
          </Button>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          {educationData.college.map((edu: any, index: number) => (
            <div key={index} className="p-4 border rounded-lg bg-white shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-purple-700">Degree {index + 1}</h3>
                {educationData.college.length > 1 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeCollegeEducation(index)}
                    className="text-red-600 border-red-600 hover:bg-red-50"
                  >
                    <Minus className="w-4 h-4 mr-2" />
                    Remove
                  </Button>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  placeholder="Programme Name"
                  value={edu.programme_name}
                  onChange={(e) => handleCollegeChange(index, 'programme_name', e.target.value)}
                  className="border-gray-300"
                />
                <Input
                  placeholder="Specialization"
                  value={edu.specialization}
                  onChange={(e) => handleCollegeChange(index, 'specialization', e.target.value)}
                  className="border-gray-300"
                />
                <Input
                  placeholder="College Name"
                  value={edu.college_name}
                  onChange={(e) => handleCollegeChange(index, 'college_name', e.target.value)}
                  className="border-gray-300"
                />
                <Input
                  placeholder="University Name"
                  value={edu.university_name}
                  onChange={(e) => handleCollegeChange(index, 'university_name', e.target.value)}
                  className="border-gray-300"
                />
                <Input
                  type="number"
                  placeholder="CGPA"
                  value={edu.cgpa}
                  onChange={(e) => handleCollegeChange(index, 'cgpa', parseFloat(e.target.value))}
                  className="border-gray-300"
                />
                <Input
                  type="number"
                  placeholder="Duration (in years)"
                  value={edu.duration}
                  onChange={(e) => handleCollegeChange(index, 'duration', parseInt(e.target.value))}
                  className="border-gray-300"
                />
                <Input
                  placeholder="Year of Commencement"
                  value={edu.year_of_commencement}
                  onChange={(e) => handleCollegeChange(index, 'year_of_commencement', e.target.value)}
                  className="border-gray-300"
                />
                <Input
                  placeholder="Year of Passing"
                  value={edu.passout_year}
                  onChange={(e) => handleCollegeChange(index, 'passout_year', e.target.value)}
                  className="border-gray-300"
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
    </>
  );
};

export default RecruiterEducationForm;

