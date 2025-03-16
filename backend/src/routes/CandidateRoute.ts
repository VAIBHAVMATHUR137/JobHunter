import {
  fetchAllCandidates,
  fetchIndividualCandidate,
  deleteCandidate,
  postCandidate,
  candidateLogin,
} from "../controller/CandidateController";
import express from "express";
import {
  createUniqueUserName,
  searchUserName,
} from "../controller/UserNameController";
import RecruiterUserName from "../schema/RecruiterUserNameSchema";
import CandidateUserName from "../schema/CandidateUserNameSchema";

const router = express.Router();
router.get("/getAllCandidates", fetchAllCandidates);
router.get("/getIndividualCandidate/:id", fetchIndividualCandidate);
router.post("/createCandidate", postCandidate);
router.delete("/deleteCandidate/:id", deleteCandidate);
router.post("/login", candidateLogin);
router.post(
  "/username/check",
  searchUserName(CandidateUserName, RecruiterUserName)
);

router.post("/username/create", createUniqueUserName(CandidateUserName));
export default router;
