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
