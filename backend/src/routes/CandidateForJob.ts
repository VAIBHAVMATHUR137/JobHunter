import { candidateForJobController } from "../controller/CandidateForJobController";
import express from "express";
const router=express.Router();
router.post('/candidatesApplied',candidateForJobController)
export default router