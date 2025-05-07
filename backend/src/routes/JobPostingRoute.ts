import express from "express";
import {
  fetchAllJobsPosted,
  deleteExistingJob,
  postNewJob,
  fetchParticularJobPosted,
} from "../controller/JobPostingController";

import {
  jobPostingValidationRules,
  validateJobPosting,
  validateJobPostingBusinessLogic,
} from "../middleware/JobPostingValidator";
import { createJobID, deleteJobID, screenJobID } from "../controller/JobIdController";
const router = express.Router();

// Public routes (accessible to both candidates and recruiters)
router.get("/fetch", fetchAllJobsPosted);
router.get("/fetchIndividualJob/:id", fetchParticularJobPosted);

// Recruiter-only routes
router.post(
  "/create",

  postNewJob
);

router.delete("/delete/:id", deleteExistingJob);
router.delete('/deleteID/:id',deleteJobID())
router.post('/createID',createJobID())
router.get('/screenID/:id',screenJobID())

export default router;
