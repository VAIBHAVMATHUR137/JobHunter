import express from 'express';
import { 
  fetchIndividualRecruiter,
  createRecruiter,
  deleteRecruiter,
  recruiterLogin,
  refreshAccessToken
} from '../controller/RecruiterController';
import { 
  recruiterValidationRules, 
  validateRecruiter,
  loginValidationRules,
  refreshTokenValidationRules 
} from '../middleware/RecruiterValidation';

const router = express.Router();

router.get('/fetchRecruiter/:username', fetchIndividualRecruiter);
router.post('/createRecruiter', recruiterValidationRules, validateRecruiter, createRecruiter);
router.delete('/deleteRecruiter/:username', deleteRecruiter);
router.post('/login', loginValidationRules, validateRecruiter, recruiterLogin);
router.post("/refresh-token", refreshTokenValidationRules, validateRecruiter, refreshAccessToken);

export default router;