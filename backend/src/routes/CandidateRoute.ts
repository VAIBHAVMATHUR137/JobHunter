import {fetchAllCandidates,fetchIndividualCandidate,deleteCandidate,postCandidate,candidateLogin} from "../controller/CandidateController"
import express from 'express'

const router=express.Router();
router.get('/getAllCandidates',fetchAllCandidates);
router.get('/getIndividualCandidate/:id',fetchIndividualCandidate)
router.post('/createCandidate',postCandidate)
router.delete('/deleteCandidate/:id',deleteCandidate)
router.post('/login',candidateLogin)
export default router