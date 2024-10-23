import express from 'express'
import {fetchAllJobsPosted, deleteExistingJob, editjobPosting, postNewJob, fetchParticularJobPosted } from '../controller/JobPostingController'
const router=express.Router();
router.get('/fetch',fetchAllJobsPosted)
router.delete('/delete/:id',deleteExistingJob)
router.put('/edit',editjobPosting)
router.post('/create',postNewJob)
router.get('/fetchIndividualJob/:id',fetchParticularJobPosted)
export default router;