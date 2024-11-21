import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { candidateRegistartionUpdate } from "../Slice/Slice";
import { RootState } from "../Slice/Store";
import Navbar from "@/components/ui/navbar";
import axios from "axios";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert } from "@/components/ui/alert";


export default function CandidateDashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const dispatch = useDispatch();
  const candidatePhoto = useSelector(
    (state: RootState) => state.candidateRegister.photo
  );

  useEffect(() => {
    const fetchCandidate = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          "http://localhost:5000/candidate/getIndividualCandidate/6734b367c837d340320d2948"
        );

        if (response.data && response.data.photo) {
          dispatch(
            candidateRegistartionUpdate({
              field: "photo",
              value: response.data.photo,
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

  return (
    <>
 
  <>
    <Navbar />
    <div className="container mx-auto mt-6">
      <div className="max-w-4xl mx-auto p-6 bg-card shadow-lg rounded-lg">
        <div className="flex flex-col items-center">
          {isLoading ? (
            <Skeleton className="h-24 w-24 rounded-full" />
          ) : error ? (
            <Alert variant="destructive">{error}</Alert>
          ) : (
            <Avatar className="h-24 w-24 rounded-full">
            <AvatarImage src={candidatePhoto} alt="Candidate Photo" />
            <AvatarFallback>CP</AvatarFallback>
          </Avatar>
          )}

          <Card className="mt-6">
            <CardHeader>
              <h2 className="text-xl font-bold">Candidate Dashboard</h2>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Welcome to your dashboard. Here you can manage your profile and access important information.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  </>
);

    </>
  );
}
