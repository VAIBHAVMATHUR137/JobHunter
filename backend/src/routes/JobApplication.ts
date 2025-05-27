import {
  JobApplicantsController,
  JobApplicationController,

  screeningController,
} from "../controller/JobApplicationController";
import express from "express";
import validateToken from "../middleware/validateToken";
const router = express.Router();
router.post("/create", JobApplicationController);

router.get("/screening", screeningController);
router.get("/jobStatus", validateToken, JobApplicantsController);
export default router;
