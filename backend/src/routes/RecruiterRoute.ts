import express from 'express'
import { fetchIndividualRecruiter,createRecruiter,deleteRecruiter,recruiterLogin,refreshToken } from '../controller/RecruiterController'
import validateToken from '../middleware/validateToken';
const router=express.Router();
router.get('/fetchRecruiter/:id',fetchIndividualRecruiter);
router.post('/createRecruiter',createRecruiter);
router.delete('/deleteRecruiter/:id',deleteRecruiter);
router.post('/login',recruiterLogin)
router.post("/refresh-token", refreshToken);
export default router