import {
  userDashboard,
  fetchAllUsers,
  getProfile,
  createUser,
  deleteUser,
  userLogin,
  userLogout,
  updateToken,
} from "../controller/UserController";
import express from "express";
import validateToken from "../middleware/validateToken";
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
import Candidate from "../schema/CandidateSchema";

const router = express.Router();

router.get("/fetch/:username", getProfile(Candidate));
router.post(
  "/create",
  createUser(Candidate),
  candidateValidationRules,
  validateCandidate
);
router.delete("/delete/:username", deleteUser(Candidate, CandidateUserName));
router.post(
  "/login",

  loginValidationRules,
  validateCandidate,
  userLogin(Candidate, "candidate")
);
router.post(
  "/refresh-token",
  refreshTokenValidationRules,
  validateCandidate,
  updateToken(Candidate, "candidate")
);
router.post(
  "/username/check",
  searchUserName(CandidateUserName, RecruiterUserName)
);

router.post("/username/create", createUniqueUserName(CandidateUserName));
router.post("/logout", userLogout(Candidate, "candidate"));

router.get("/fetchAll", fetchAllUsers(Candidate));
router.get("/dashboard", validateToken, userDashboard(Candidate));
router.get("/fetch/:username", getProfile(Candidate));

export default router;
