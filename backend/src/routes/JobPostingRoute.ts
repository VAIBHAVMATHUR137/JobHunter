import express from 'express'
import {fetchAllJobsPosted, deleteExistingJob, editjobPosting, postNewJob, fetchParticularJobPosted } from '../controller/JobPostingController'
import validateToken from '../middleware/validateToken';
const router=express.Router();
router.get('/fetch',validateToken,fetchAllJobsPosted)
router.delete('/delete/:id',validateToken,deleteExistingJob)
router.put('/edit',validateToken,editjobPosting)
router.post('/create',validateToken,postNewJob)
router.get('/fetchIndividualJob/:id',validateToken,fetchParticularJobPosted)
export default router;