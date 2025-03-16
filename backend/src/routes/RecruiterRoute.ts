import express from "express";
import {
  fetchIndividualRecruiter,
  createRecruiter,
  deleteRecruiter,
  recruiterLogin,
  refreshAccessToken,
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

router.get("/fetchRecruiter/:username", fetchIndividualRecruiter);
router.post(
  "/createRecruiter",
  recruiterValidationRules,
  validateRecruiter,
  createRecruiter
);
router.delete("/deleteRecruiter/:username", deleteRecruiter);
router.post("/login", loginValidationRules, validateRecruiter, recruiterLogin);
router.post(
  "/refresh-token",
  refreshTokenValidationRules,
  validateRecruiter,
  refreshAccessToken
);
router.post("/username/check", searchUserName(RecruiterUserName,CandidateUserName));

router.post("/username/create", createUniqueUserName(RecruiterUserName));

export default router;
