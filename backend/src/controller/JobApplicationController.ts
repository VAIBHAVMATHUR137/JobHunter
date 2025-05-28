import expressAsyncHandler from "express-async-handler";
import { Request, Response } from "express";
import { JobApplicationSchema } from "../schema/JobApplicationSchema";
import JobPosting from "../schema/JobPostingSchema";
export const JobApplicationController = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const { candidateProfile, job, recruiterUsername } = req.body;
    if (!candidateProfile || !job || !recruiterUsername) {
      res.status(400).json({ Message: "Data is missing" });
      return;
    }
    try {
      const data = await JobApplicationSchema.create({
        candidateProfile,
        job,
        recruiterUsername,
      });
      if (data) {
        res.status(200).json(data);
        return;
      }
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ Message: "Job application failed, please try again" });
    }
  }
);

export const screeningController = expressAsyncHandler(
  async (req: Request, res: Response) => {
    try {
      const { jobID, candidateUsername, recruiterUsername } = req.query;

      if (!jobID) {
        res.status(400).json({ Message: "Job field is mandatory" });
        return;
      }

      // If the candidate's job application is undergoing verification
      if (!recruiterUsername && candidateUsername && jobID) {
        // Option 1: Query by nested object fields (if you store username/email in candidateProfile)
        const application = await JobApplicationSchema.findOne({
          "candidateProfile.username": candidateUsername, // Assuming candidateProfile is username
          "job.jobID": jobID, // Assuming job is jobID
        });

        if (!application) {
          // Case where candidate has not applied for this job before
          res.status(200).json({
            hasApplied: false,
            applicationDetails: null, 
          });
          return;
        } else {
          // Case where candidate has already applied for the same job in past
          res.status(403).json({
            hasApplied: true,
            applicationDetails: application,
          });
          return;
        }
      }

      // If recruiter's job post is verified
      if (!candidateUsername && recruiterUsername && jobID) {
        const recruitment = await JobPosting.findOne({
          username: recruiterUsername,
          jobID,
        });

        if (recruitment) {
          res.status(200).json({
            hasPosted: true,
            recruitmentDetails: recruitment,
          });
          return;
        } else if (!recruitment) {
          res.status(403).json({
            hasPosted: false,
            recruitmentDetails: null,
          });
          return;
        }
      }

      // If neither condition is met
      res.status(400).json({
        message: "Invalid request parameters",
      });
      return;
    } catch (error) {
      console.error("Screening controller error:", error);
      res.status(500).json({
        message: "Failed to check application status, please try again",
      });
      return;
    }
  }
);
export const JobApplicantsController = expressAsyncHandler(
  async (req: Request, res: Response) => {
    try {
      const { recruiterUsername, candidateUsername, jobID } = req.query;

      // Case 1: Recruiter checking candidates for a job

      if (recruiterUsername && jobID) {
        const applicants = await JobApplicationSchema.find({
          recruiterUsername,
          "job.jobID": jobID,
        });

        res
          .status(200)
          .json(
            applicants
              .filter((x) => x.candidateProfile)
              .map((x) => x.candidateProfile)
          );
        return;
      }

      // Case 2: Candidate checking all jobs they've applied to
      if (candidateUsername) {
        const jobsApplied = await JobApplicationSchema.find({
          "candidateProfile.username": candidateUsername,
        });
        res
          .status(200)
          .json(jobsApplied.filter((x) => x.job).map((x) => x.job));
        return;
      }

      // Case 3: Recruiter checking all jobs they posted
      if (recruiterUsername) {
        const jobsPosted = await JobPosting.find({
          username: recruiterUsername,
        });
        res.status(200).json(jobsPosted);
        return;
      }

      // Case 4: Get all jobs by jobID
      if (jobID) {
        const jobsWithId = await JobApplicationSchema.find({
          "job.jobID": jobID,
        });
        res.status(200).json(jobsWithId);
        return;
      }

      // Case 5: No useful input
      res.status(400).json({
        error:
          "Invalid or missing parameters. Please provide at least one of: recruiterUsername, candidateUsername, or jobID.",
      });
      return;
    } catch (error) {
      console.error("Error in JobApplicantsController:", error);
      res.status(500).json({
        error: "Server error occurred while processing your request.",
      });
      return;
    }
  }
);
