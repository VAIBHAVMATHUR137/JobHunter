import expressAsyncHandler from "express-async-handler";
import { Request, Response } from "express";
import { CandidateForJobSchema } from "../schema/CandidatesForJobsSchema";
export const candidateForJobController = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const { candidateUsername, jobID, recruiterUsername } = req.body;
    if (!candidateUsername || !jobID || !recruiterUsername) {
      res.status(400).json({ Message: "Data is missing" });
      return;
    }
    try {
      const data = await CandidateForJobSchema.create({
        candidateUsername,
        jobID,
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


export const checkCandidateJobApplication = expressAsyncHandler(
  async (req: Request, res: Response) => {

    const { candidateUsername, jobID } = req.body;

    // Validate required parameters
    if (!candidateUsername || !jobID) {
      res.status(400).json({ message: "Candidate username and job ID are required" });
      return;
    }

    try {
      // Check if the combination exists in the database
      const application = await CandidateForJobSchema.findOne({
        candidateUsername,
        jobID
      });

      // Return the result
      if (!application) {
        //Case where candidate has not applied for this job before
        res.status(200).json({ 
          hasApplied: false,
          applicationDetails: application 
        });
      } 
      //Case where candidate has already applied for the same job in past
      else {
        res.status(403).json({ 
          hasApplied: true 
        });
      }
    } catch (error:any) {

      res.status(500).json({ 
        message: "Failed to check application status, please try again" 
      });
    }
  }
);