import express from "express";

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

import validateToken from "../middleware/validateToken";
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
import Recruiter from "../schema/RecruiterSchema";
import JobPosting from "../schema/JobPostingSchema";

const router = express.Router();

router.post(
  "/create",
  recruiterValidationRules,
  validateRecruiter,
  createUser(Recruiter)
);

router.delete(
  "/delete/:username",
  deleteUser(Recruiter, RecruiterUserName, JobPosting)
);

router.post(
  "/login",
  loginValidationRules,
  validateRecruiter,
  userLogin(Recruiter, "recruiter")
);
router.post(
  "/refresh-token",
  refreshTokenValidationRules,
  validateRecruiter,
  updateToken(Recruiter, "recruiter")
);
router.post(
  "/username/check",
  searchUserName(RecruiterUserName, CandidateUserName)
);
router.post("/username/create", createUniqueUserName(RecruiterUserName));
router.post("/logout", userLogout(Recruiter, "recruiter"));

router.get("/fetchAll", fetchAllUsers(Recruiter));
router.get("/dashboard", validateToken, userDashboard(Recruiter));
router.get("/fetch/:username", getProfile(Recruiter));

export default router;
