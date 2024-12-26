import express from 'express'
import { fetchIndividualRecruiter,createRecruiter,deleteRecruiter,recruiterLogin,refreshAccessToken} from '../controller/RecruiterController'

const router=express.Router();
router.get('/fetchRecruiter/:id',fetchIndividualRecruiter);
router.post('/createRecruiter',createRecruiter);
router.delete('/deleteRecruiter/:id',deleteRecruiter);
router.post('/login',recruiterLogin)
router.post("/refresh-token", refreshAccessToken);
export default router