import JobPosting from "../schema/JobPostingSchema";
import { Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import { jobIDSchema } from "../schema/JobIDschema";
import { JobApplicationSchema } from "../schema/JobApplicationSchema";


//THE PURPOSE OF THIS FUNCTION IS TO RETURN ALL THE JOB POSTINGS, AFTER FILTERING
export const fetchAll = expressAsyncHandler(
  async (req: Request, res: Response) => {
    try {
      const allJobs = await JobPosting.find();
      const { username } = req.query;

      if (!username) {
        console.log("Finding All jobs");
        res.status(200).json(allJobs);
        return;
      }

      const jobsAppliedByCandidate = await JobApplicationSchema.find({
        "candidateProfile.username": username,
      });

      const recruitments = await JobPosting.find({
        username: username,
      });

      if (jobsAppliedByCandidate.length > 0) {
        const appliedJobID = new Set(
          jobsAppliedByCandidate.map((application) => application.job.jobID)
        );
        const availableJobs = allJobs.filter(
          (job) => !appliedJobID.has(job.jobID)
        );
        res.status(200).json(availableJobs);
        return;
      } else if (recruitments.length > 0) {
        const postedJobID = new Set(
          recruitments.map((recruitment) => recruitment.jobID)
        );
        const newJobs = allJobs.filter((job) => !postedJobID.has(job.jobID));
        res.status(200).json(newJobs);
        return;
      } else {
        //  If username is unknown, or has no activity (no posts, no applications), return all jobs
        console.log(
          "Username provided but no activity found — returning all jobs"
        );
        res.status(200).json(allJobs);
        return;
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Error fetching jobs", error });
      return;
    }
  }
);

//Fetch a particular job posted by recruiter
export const fetchParticularJobPosted = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const jobID = req.params.jobID;
    const jobposted = await JobPosting.findOne({ jobID });
    if (!jobposted) {
      res.status(404);
      throw new Error("No such job exists");
    }
    res.status(200).json(jobposted);
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
      jobID,
    } = req.body;

    // Add recruiter information to the job posting
    try {
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
        jobID,
      });

      res.status(201).json({ Message: "Job created successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Something went wrong on the server." });
      return;
    }
  }
);

//Delete job posted by recruiter
export const deleteExistingJob = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const jobID = req.params.jobID;
    const jobposting = await JobPosting.findOne({ jobID });

    if (!jobposting) {
      res.status(404);
      throw new Error("Job posting not found");
    }
    try {
      await Promise.all([
        JobPosting.deleteOne({ jobID }),
        jobIDSchema.deleteOne({ jobID }),
        JobApplicationSchema.deleteMany({ "job.jobID": jobID }),
      ]);
      res.status(200).json({
        message: "Job posting for this role has been deleted",
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ Message: "Cannot delete the user" });
    }
  }
);
