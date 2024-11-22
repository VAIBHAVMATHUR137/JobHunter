import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { RootState } from "@/Slice/Store";
import { candidateRegistartionUpdate } from "@/Slice/Slice";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

import { MapPin, Phone, Mail, Briefcase, GraduationCap } from 'lucide-react';
import Navbar from "@/components/ui/navbar";

export default function CandidateDashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const dispatch = useDispatch();
  const candidateDetails = useSelector(
    (state: RootState) => state.candidateRegister
  );

  const skills = Array.isArray(candidateDetails.skills) 
    ? candidateDetails.skills 
    : Object.values(candidateDetails.skills || {});

  useEffect(() => {
    const fetchCandidate = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          "http://localhost:5000/candidate/getIndividualCandidate/673ece650d5f1a004c564946"
        );
        if (response.data) {
          dispatch(
            candidateRegistartionUpdate({
              field: "name",
              value: response.data.name,
            })
          );
          dispatch(
            candidateRegistartionUpdate({
              field: "email",
              value: response.data.email,
            })
          );
          dispatch(
            candidateRegistartionUpdate({
              field: "photo",
              value: response.data.photo,
            })
          );
          dispatch(
            candidateRegistartionUpdate({
              field: "current_location",
              value: response.data.current_location,
            })
          );
          dispatch(
            candidateRegistartionUpdate({
              field: "number",
              value: response.data.number,
            })
          );
          dispatch(
            candidateRegistartionUpdate({
              field: "skills",
              value: response.data.skills || [],
            })
          );
          dispatch(
            candidateRegistartionUpdate({
              field: "years_of_experience",
              value: response.data.years_of_experience,
            })
          );
          dispatch(
            candidateRegistartionUpdate({
              field: "degree",
              value: response.data.degree,
            })
          );
        }
      } catch (error) {
        setError("Failed to load candidate data");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCandidate();
  }, [dispatch]);

  if (isLoading) {
    return (
      <div className="container mx-auto p-4">
        <Card className="w-full max-w-4xl mx-auto">
          <CardHeader>
            <Skeleton className="h-12 w-[250px]" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Skeleton className="h-4 w-[200px]" />
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[300px]" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <Card className="w-full max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="text-red-500">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <>
    <Navbar/>
    <div className="container mx-auto p-4">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader className="pb-0">
          <div className="flex justify-between items-start">
            <div className="flex items-center space-x-4">
              <Avatar className="h-20 w-20">
                <AvatarImage
                  src={candidateDetails.photo}
                  alt={candidateDetails.name}
                />
                <AvatarFallback>
                  {candidateDetails.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-2xl">
                  {candidateDetails.name}
                </CardTitle>
                <CardDescription className="text-lg">
                  Software Developer
                </CardDescription>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <MapPin className="text-gray-500" size={18} />
                <span>{candidateDetails.current_location}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="text-gray-500" size={18} />
                <span>{candidateDetails.number}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="text-gray-500" size={18} />
                <span>{candidateDetails.email}</span>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Briefcase className="text-gray-500" size={18} />
                <span>
                  {candidateDetails.years_of_experience} years of experience
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <GraduationCap className="text-gray-500" size={18} />
                <span>{candidateDetails.degree}</span>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-2">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, index) => (
                <Badge key={index} variant="secondary" className="text-sm py-1 px-3">
                  {typeof skill === 'string' ? skill : JSON.stringify(skill)}
                </Badge>
              ))}
            </div>
          </div>

          <div className="mt-8 space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">About Me</h3>
              <p className="text-gray-600">
                Passionate software developer with 5 years of experience in
                building scalable web applications. Skilled in React, Node.js,
                and cloud technologies. Always eager to learn and take on new
                challenges.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Work Experience</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium">
                    Senior Developer at Tech Solutions Inc.
                  </h4>
                  <p className="text-sm text-gray-500">2020 - Present</p>
                  <p className="mt-1 text-gray-600">
                    Led a team of 5 developers in creating a cloud-based project
                    management tool.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium">
                    Junior Developer at StartUp Co.
                  </h4>
                  <p className="text-sm text-gray-500">2018 - 2020</p>
                  <p className="mt-1 text-gray-600">
                    Developed and maintained multiple client-facing web
                    applications.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
    </>
  );
}

