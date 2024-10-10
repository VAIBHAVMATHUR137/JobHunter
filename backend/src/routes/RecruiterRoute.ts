import express from 'express'
import { fetchIndividualRecruiter,createRecruiter,deleteRecruiter } from '../controller/RecruiterController'
const router=express.Router();
router.get('/fetchRecruiter/:id',fetchIndividualRecruiter);
router.post('/createRecruiter',createRecruiter);
router.delete('/deleteRecruiter/:id',deleteRecruiter);
export default router