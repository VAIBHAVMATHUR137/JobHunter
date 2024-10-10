import {fetchAllCandidates,fetchIndividualCandidate,deleteCandidate,postCandidate} from "../controller/CandidateController"
import express from 'express'

const router=express.Router();
router.get('/getAllCandidates',fetchAllCandidates);
router.get('/getIndividualCandidate/:id',fetchIndividualCandidate)
router.post('/createCandidate',postCandidate)
router.delete('/deleteCandidate/:id',deleteCandidate)
export default router