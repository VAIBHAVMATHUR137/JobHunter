import express from "express";
import {
  fetchAllJobsPosted,
  deleteExistingJob,
  postNewJob,
  fetchParticularJobPosted,
} from "../controller/JobPostingController";

import {
  createJobID,
  deleteJobID,
  screenJobID,
} from "../controller/JobIdController";

const router = express.Router();

// Public routes (accessible to both candidates and recruiters)
router.get("/fetch",fetchAllJobsPosted);
router.get("/fetchIndividualJob/:jobID", fetchParticularJobPosted);

// Recruiter-only routes
router.post(
  "/create",

  postNewJob
);

router.delete("/delete/:jobID", deleteExistingJob);
router.delete("/deleteID/:jobID", deleteJobID());
router.post("/createID", createJobID());
router.get("/screenID/:jobID", screenJobID());

export default router;
