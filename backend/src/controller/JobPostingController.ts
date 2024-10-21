import JobPosting from "../schema/JobPostingSchema";
import { Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";

//Fetch al the jobs posted by a particular recruiter
export const fetchAllJobsPosted = expressAsyncHandler(
  async (req: Request, res: Response) => {
    res.status(200).json({ Message: "fetchAllJobsPosted API running fine" });
  }
);
//Edit requirements of job already posted by recruiter
export const editjobPosting = expressAsyncHandler(
  async (req: Request, res: Response) => {
    res.status(200).json({ Message: "editJobPosting API running fine" });
  }
);

//Post a new job by recruiter
export const postNewJob = expressAsyncHandler(
  async (req: Request, res: Response) => {
    res.status(200).json({ Message: "postNewJob API running fine" });
  }
);

//Delete job posted by recruiter
export const deleteExistingJob = expressAsyncHandler(
  async (req: Request, res: Response) => {
    res.status(200).json({ Message: "deleteExistingJob API running fine" });
  }
);
