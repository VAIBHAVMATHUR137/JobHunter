import {
  fetchIndividualCandidate,
  deleteCandidate,
  createCandidate,
  candidateLogin,
  refreshAccessToken,
  candidateLogout,
} from "../controller/CandidateController";
import express from "express";
import {
  createUniqueUserName,
  searchUserName,
} from "../controller/UserNameController";

import {
  candidateValidationRules,
  validateCandidate,
  loginValidationRules,
  refreshTokenValidationRules,
} from "../middleware/CandidateValidation";

import RecruiterUserName from "../schema/RecruiterUserNameSchema";
import CandidateUserName from "../schema/CandidateUserNameSchema";

const router = express.Router();

router.get("/getCandidate/:username", fetchIndividualCandidate);
router.post(
  "/createCandidate",
  createCandidate,
  candidateValidationRules,
  validateCandidate
);
router.delete("/deleteCandidate/:username", deleteCandidate);
router.post(
  "/login",
  candidateLogin,
  loginValidationRules,
  validateCandidate,
  candidateLogin
);
router.post(
  "/refresh-token",
  refreshTokenValidationRules,
  validateCandidate,
  refreshAccessToken
);
router.post(
  "/username/check",
  searchUserName(CandidateUserName, RecruiterUserName)
);

router.post("/username/create", createUniqueUserName(CandidateUserName));
router.post("/logout", candidateLogout);
export default router;
