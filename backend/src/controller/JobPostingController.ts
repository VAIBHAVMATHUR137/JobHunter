import JobPosting from "../schema/JobPostingSchema";
import { Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";

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
    if (jobPosting.username.toString() !== req.user?.id) {
      res.status(403);
      throw new Error("You can only edit your own job postings");
    }

    const updatedJob = await JobPosting.findByIdAndUpdate(jobId, req.body, {
      new: true,
    });

    res.status(200).json(updatedJob);
  }
);

//Post a new job by recruiter
export const postNewJob = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const {
      designation,

      CTC,
      experience_required_in_months,
      isFresherEligible,
      degree_required,
      bond,
      work_environment,
      job_location,
      job_description,
      company_name,
      skills_required,
      type_of_employment,
      perks_and_benefits,
      required_languages,
      isVisaSponsored,
      username,
      name,
      email,
    } = req.body;

    // Add recruiter information to the job posting
    const job = await JobPosting.create({
      designation,

      CTC,
      experience_required_in_months,
      isFresherEligible,
      degree_required,
      bond,
      work_environment,
      job_location,
      job_description,
      company_name,
      skills_required,
      type_of_employment,
      perks_and_benefits,
      required_languages,
      isVisaSponsored,
      username,
      name,
      email,
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
    if (jobposting.username.toString() !== req.user?.id) {
      res.status(403);
      throw new Error("You can only delete your own job postings");
    }

    await JobPosting.deleteOne({ _id: req.params.id });
    res.status(200).json({
      message: `Job posting for the role of ${jobposting.designation} has been deleted`,
    });
  }
);
