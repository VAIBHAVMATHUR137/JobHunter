import {
  JobApplicantsController,
  JobApplicationController,
  JobApplicationScreeningController,
} from "../controller/JobApplicationController";
import express from "express";
import validateToken from "../middleware/validateToken";
const router = express.Router();
router.post("/create", JobApplicationController);
router.post("/screen", JobApplicationScreeningController);

router.get("/jobStatus",validateToken, JobApplicantsController);
export default router;
