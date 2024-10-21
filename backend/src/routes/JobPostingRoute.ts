import express from 'express'
import {fetchAllJobsPosted, deleteExistingJob, editjobPosting, postNewJob } from '../controller/JobPostingController'
const router=express.Router();
router.get('/fetch',fetchAllJobsPosted)
router.delete('/delete',deleteExistingJob)
router.put('/edit',editjobPosting)
router.post('/create',postNewJob)
export default router;