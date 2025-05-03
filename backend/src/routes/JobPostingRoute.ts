import express from "express";
import {
  fetchAllJobsPosted,
  deleteExistingJob,
  editjobPosting,
  postNewJob,
  fetchParticularJobPosted,
  recruiterOnly,
} from "../controller/JobPostingController";
import validateToken from "../middleware/validateToken";
import {
  jobPostingValidationRules,
  validateJobPosting,
  validateJobPostingBusinessLogic,
} from "../middleware/JobPostingValidator";
const router = express.Router();

// Public routes (accessible to both candidates and recruiters)
router.get("/fetch", validateToken, fetchAllJobsPosted);
router.get("/fetchIndividualJob/:id", validateToken, fetchParticularJobPosted);

// Recruiter-only routes
router.post(
  "/create",
  
  validateToken,
  recruiterOnly,
  jobPostingValidationRules,
  validateJobPosting,
  validateJobPostingBusinessLogic,
  postNewJob
);
router.put("/edit/:id", validateToken, recruiterOnly, editjobPosting);
router.delete("/delete/:id", validateToken, recruiterOnly, deleteExistingJob);

export default router;
