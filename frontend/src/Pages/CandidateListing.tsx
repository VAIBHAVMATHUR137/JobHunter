import Navbar from "@/components/ui/navbar";
import { fetchAllCandidates } from "@/Slice/CandidateThunk";
import { AppDispatch, RootState } from "@/Slice/Store";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Briefcase } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

function CandidateListing() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  useEffect(() => {
    dispatch(fetchAllCandidates()).unwrap();
  }, [dispatch]);
  const res = useSelector((state: RootState) => state.fetch_all_candidates);
  const handleCandidateCardClick = (username: string) => {
    navigate(`/Candidate/${username}`);
  };
  return (
    <div className='className="min-h-screen bg-gray-50"'>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-10 text-gray-800">
          Top Performing Candidates
        </h1>
        {res.isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-primary"></div>
          </div>
        ) : res.error ? (
          <div className="text-center text-red-500 p-4">{res.error}</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {res.candidateData.map((candidate) => (
              <Card
                key={candidate.username}
                className="w-full h-48 shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden cursor-pointer hover:scale-105 "
                onClick={() => handleCandidateCardClick(candidate.username)}
              >
                <div className="flex flex-col items-center h-full">
                  <div className="w-full h-24 flex justify-center items-center pt-4">
                    <Avatar className="h-20 w-20 border-2 border-primary/20">
                      <AvatarImage
                        src={candidate.photo || "/placeholder.svg"}
                        alt={`${candidate.firstName} ${candidate.lastName}`}
                      />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {candidate.firstName?.[0]}
                        {candidate.lastName?.[0]}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <CardContent className="p-4 text-center w-full">
                    <p className="font-semibold text-lg truncate">
                      @{candidate.username}
                    </p>
                    <div className="flex items-center justify-center mt-2 text-sm text-gray-600">
                      <Briefcase className="h-4 w-4 mr-1 text-primary" />
                      <span className="truncate">
                        {candidate.current_job.company}
                      </span>
                    </div>
                  </CardContent>
                </div>
              </Card>
            ))}
          </div>
        )}
        {res.candidateData.length === 0 && !res.isLoading && !res.error && (
          <div className="text-center text-gray-500 p-8">
            No recruiters found.
          </div>
        )}
      </div>
    </div>
  );
}

export default CandidateListing;
