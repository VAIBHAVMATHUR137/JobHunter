"use client"

import Navbar from "@/components/ui/navbar"
import type { AppDispatch, RootState } from "@/Slice/Store"
import { fetchAllRecruiters } from "@/Slice/RecruiterThunk"
import { useDispatch, useSelector } from "react-redux"
import { Card, CardContent } from "@/components/ui/card"
import { Briefcase } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useEffect } from "react"

function RecruiterListing() {
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    dispatch(fetchAllRecruiters()).unwrap()
  }, [dispatch])

  const res = useSelector((state: RootState) => state.fetch_all_recruiters)

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-10 text-gray-800">Top Recruiters</h1>

        {res.isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-primary"></div>
          </div>
        ) : res.error ? (
          <div className="text-center text-red-500 p-4">{res.error}</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {res.recruiterData.map((recruiter) => (
              <Card
                key={recruiter.username}
                className="w-full h-48 shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
              >
                <div className="flex flex-col items-center h-full">
                  <div className="w-full h-24 flex justify-center items-center pt-4">
                    <Avatar className="h-20 w-20 border-2 border-primary/20">
                      <AvatarImage
                        src={recruiter.photo || "/placeholder.svg"}
                        alt={`${recruiter.firstName} ${recruiter.lastName}`}
                      />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {recruiter.firstName?.[0]}
                        {recruiter.lastName?.[0]}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <CardContent className="p-4 text-center w-full">
                    <p className="font-semibold text-lg truncate">@{recruiter.username}</p>
                    <div className="flex items-center justify-center mt-2 text-sm text-gray-600">
                      <Briefcase className="h-4 w-4 mr-1 text-primary" />
                      <span className="truncate">{recruiter.current_job.company}</span>
                    </div>
                  </CardContent>
                </div>
              </Card>
            ))}
          </div>
        )}

        {res.recruiterData.length === 0 && !res.isLoading && !res.error && (
          <div className="text-center text-gray-500 p-8">No recruiters found.</div>
        )}
      </div>
    </div>
  )
}

export default RecruiterListing
