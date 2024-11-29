import JobPosting from "../schema/JobPostingSchema";
import { Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";

// Custom Middleware to ensure only recruiters can access the job posting 
export const recruiterOnly = (req: Request, res: Response, next: Function) => {
  if (req.user?.role !== 'recruiter') {
    res.status(403).json({"Message":"Access denied: Only recruiters can perform this action"});
    return;
  }
  next();
};

//Fetch all the jobs posted by a particular recruiter
export const fetchAllJobsPosted = expressAsyncHandler(
  async (req: Request, res: Response) => {
    try {
      const jobposted = await JobPosting.find();
      res.status(200).json(jobposted);
    } catch (error) {
      res.status(500).json({ message: "Error fetching jobs", error });
    }
  }
);

//Fetch a particular job posted by recruiter
export const fetchParticularJobPosted = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const jobposted = await JobPosting.findById(req.params.id);
    if (!jobposted) {
      res.status(404);
      throw new Error("No such job exists");
    }
    res.status(200).json(jobposted);
  }
);

//Edit requirements of job already posted by recruiter
export const editjobPosting = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const jobId = req.params.id;
    const jobPosting = await JobPosting.findById(jobId);

    if (!jobPosting) {
      res.status(404);
      throw new Error("Job posting not found");
    }

    // Convert IDs to strings for comparison
    if (jobPosting.recruiterId.toString() !== req.user?.id) {
      res.status(403);
      throw new Error("You can only edit your own job postings");
    }

    const updatedJob = await JobPosting.findByIdAndUpdate(
      jobId,
      req.body,
      { new: true }
    );

    res.status(200).json(updatedJob);
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
      !experience_required ||
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

    // Validate experience logic
    if (experience_required === "FALSE" && years_of_experience_required > 0) {
      res.status(400);
      throw new Error(
        "This is a fresher job and cannot demand experience from candidate"
      );
    }

    // Add recruiter information to the job posting
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
      recruiterId: req.user?.id,
      recruiterEmail: req.user?.email, 
    });

    res.status(201).json(job);
  }
);

//Delete job posted by recruiter
export const deleteExistingJob = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const jobposting = await JobPosting.findById(req.params.id);
    
    if (!jobposting) {
      res.status(404);
      throw new Error("Job posting not found");
    }

    // Convert IDs to strings for comparison
    if (jobposting.recruiterId.toString() !== req.user?.id) {
      res.status(403);
      throw new Error("You can only delete your own job postings");
    }

    await JobPosting.deleteOne({ _id: req.params.id });
    res.status(200).json({
      message: `Job posting for the role of ${jobposting.job_role} has been deleted`,
    });
  }
);

