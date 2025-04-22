import express from "express";
import {
  fetchIndividualRecruiter,
  createRecruiter,
  deleteRecruiter,
  recruiterLogin,
  refreshAccessToken,
  recruiterLogout,
  fetchAllRecruiters,
} from "../controller/RecruiterController";
import {
  recruiterValidationRules,
  validateRecruiter,
  loginValidationRules,
  refreshTokenValidationRules,
} from "../middleware/RecruiterValidation";
import {
  createUniqueUserName,
  searchUserName,
} from "../controller/UserNameController";
import RecruiterUserName from "../schema/RecruiterUserNameSchema";
import CandidateUserName from "../schema/CandidateUserNameSchema";

const router = express.Router();

router.get("/fetch/:username", fetchIndividualRecruiter);
router.post(
  "/create",
  recruiterValidationRules,
  validateRecruiter,
  createRecruiter
);
router.delete("/delete/:username", deleteRecruiter);
router.post("/login", loginValidationRules, validateRecruiter, recruiterLogin);
router.post(
  "/refresh-token",
  refreshTokenValidationRules,
  validateRecruiter,
  refreshAccessToken
);
router.post("/username/check", searchUserName(RecruiterUserName,CandidateUserName));

router.post("/username/create", createUniqueUserName(RecruiterUserName));
router.post('/logout',recruiterLogout)
router.get('/fetchAll', fetchAllRecruiters)

export default router;
