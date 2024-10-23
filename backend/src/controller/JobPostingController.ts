import JobPosting from "../schema/JobPostingSchema";
import e, { Request, Response } from "express";
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
    const {
      job_role,
      CTC,
      experience_required,
      years_of_experience_required,
      degree_required,
      bond,
      job_location,
      company,
      skills_required,
    } = req.body;
    if (
      !job_role ||
      !CTC ||
      !years_of_experience_required ||
      !degree_required ||
      !bond ||
      !job_location ||
      !company ||
      !skills_required
    ) {
      res.status(400);
      throw new Error(
        "All fields are mandatory for a recruiter to post a new job"
      );
    }
    if (experience_required == false && years_of_experience_required > 0) {
      throw new Error(
        "This is a fresher job and cannot demand experience from candidate"
      );
    }
    const job = await JobPosting.create({
      job_role,
      CTC,
      experience_required,
      years_of_experience_required,
      degree_required,
      bond,
      job_location,
      company,
      skills_required,
    });
    console.log(
      `Here we created a job for ${company} for recruitment of ${job_role}`
    );
    if (job) {
      res.status(201).json(job);
      console.log(`Here we created a candidate with id: ${job._id}`);
    } else {
      res.status(400);
      throw new Error("Data entered by candidate is not valid");
    }
  }
);

//Delete job posted by recruiter
export const deleteExistingJob = expressAsyncHandler(
  async (req: Request, res: Response) => {
    res.status(200).json({ Message: "deleteExistingJob API running fine" });
  }
);
