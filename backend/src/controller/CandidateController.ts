import Candidate from "../schema/CandidateSchema";
import { Request, Response } from "express";

export const fetchAllCandidates = async (req: Request, res: Response) => {
  try {
    const candidates = await Candidate.find();
    res.status(200).json(candidates);
  } catch (error) {
    res.status(500).json({ message: "Error fetching candidates", error });
  }
};
export const fetchIndividualCandidate = async (req: Request, res: Response) => {
  const candidate = await Candidate.findById(req.params.id);
  if (!candidate) {
    res.status(400);
    throw new Error("Candidate do not exist");
  }
  res
    .status(200)
    .json(`Here we found application for the candidate ${req.body.name}`);
};
export const postCandidate = async (req: Request, res: Response) => {
  const {
    name,
    email,
    number,
    password,
    current_location,
    degree,
    skills,
    college_name,
    college_tier,
    preferred_location,
    notice_period,
    years_of_experience,
    github,
    xProfile,
    linkedin,
    portfolio,
  } = req.body;
  if (
    !name ||
    !email ||
    !number ||
    !password ||
    !current_location ||
    !degree ||
    !skills ||
    !college_name ||
    !college_tier ||
    !preferred_location ||
    !notice_period ||
    !years_of_experience ||
    !github ||
    !linkedin
  ) {
    res.status(400);
    throw new Error("All fields are mandatory");
  }
  const candidate = await Candidate.create({
    name,
    email,
    number,
    password,
    current_location,
    degree,
    skills,
    college_name,
    college_tier,
    preferred_location,
    notice_period,
    years_of_experience,
    github,
    xProfile,
    linkedin,
    portfolio,
  });
  res.status(200).json(candidate);
};
export const deleteCandidate = async (req: Request, res: Response) => {
  const candidate = await Candidate.findById(req.params.id);
  if (!candidate) {
    res.status(400);
    throw new Error("Such candidate do not exists in our database");
  }
  await Candidate.deleteOne({ _id: candidate._id });
  res.status(200).json(`Candidate ${candidate.name} has been deleted`);
};
