import express from "express";
import {
  fetchAllJobsPosted,
  deleteExistingJob,
  editjobPosting,
  postNewJob,
  fetchParticularJobPosted,
} from "../controller/JobPostingController";

import {
  jobPostingValidationRules,
  validateJobPosting,
  validateJobPostingBusinessLogic,
} from "../middleware/JobPostingValidator";
const router = express.Router();

// Public routes (accessible to both candidates and recruiters)
router.get("/fetch", fetchAllJobsPosted);
router.get("/fetchIndividualJob/:id", fetchParticularJobPosted);

// Recruiter-only routes
router.post(
  "/create",

  postNewJob
);
router.put("/edit/:id", editjobPosting);
router.delete("/delete/:id", deleteExistingJob);

export default router;
