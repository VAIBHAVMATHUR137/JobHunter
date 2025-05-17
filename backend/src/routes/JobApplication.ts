import {
  JobApplicantsController,
  JobApplicationController,
  JobApplicationScreeningController,
} from "../controller/JobApplicationController";
import express from "express";
const router = express.Router();
router.post("/create", JobApplicationController);
router.post("/screen", JobApplicationScreeningController);

router.get("/jobStatus", JobApplicantsController);
export default router;
