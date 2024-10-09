import {fetchAllCandidates,fetchIndividualCandidate} from "../controller/CandidateController"
import express from 'express'

const router=express.Router();
router.get('/getAllCandidates',fetchAllCandidates);
router.get('/getIndividualCandidate/:id',fetchIndividualCandidate)
export default router