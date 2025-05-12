import { candidateForJobController, checkCandidateJobApplication } from "../controller/CandidateForJobController";
import express from "express";
const router=express.Router();
router.post('/candidatesApplied',candidateForJobController);
router.post('/screeningCandidates', checkCandidateJobApplication)
export default router