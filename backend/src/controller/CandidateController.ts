import Candidate from "../schema/CandidateSchema";

import { Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const SECRET_ACCESS_TOKEN = process.env.SECRET_ACCESS_TOKEN;
//Fetching all the candidates registered at the portal
export const fetchAllCandidates = expressAsyncHandler(
  async (req: Request, res: Response) => {
    try {
      const candidates = await Candidate.find();
      res.status(200).json(candidates);
    } catch (error) {
      res.status(500).json({ message: "Error fetching candidates", error });
    }
  }
);
//Fetching a particular candidate, registered at the portal

export const fetchIndividualCandidate = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const candidate = await Candidate.findById(req.params.id);
    if (!candidate) {
      res.status(400);
      throw new Error("Candidate do not exist");
    }
    res.status(200).json(candidate);
  }
);
//Registartion by a candidate at portal
export const postCandidate = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const {
      firstName,
      lastName,
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
      photo,
      resume,
      username
    } = req.body;
    if (
      !firstName ||
      !lastName ||
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
      !linkedin ||
      !photo ||
      !resume||
      !username
    ) {
      res.status(400).json({ Message: "All fields are mandatory" });
      return;
    }
    //Check if candidate with same email or number exists

    const existingCandidate = await Candidate.findOne({
      $or: [{ email }, { number }],
    });

    if (existingCandidate) {
      res.status(409).json({
        message: "Candidate with this email or number already exists",
      });
      return;
    }
    const hashedPassword = await bcrypt.hash(password, 8);
    console.log("Hashed Password", hashedPassword);

    const candidate = await Candidate.create({
      firstName,
      lastName,
      email,
      number,
      password: hashedPassword,
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
      photo,
      resume,
      username
    });

    console.log(`Here we created a candidate ${candidate}`);

    if (candidate) {
      res.status(201).json(candidate);
      console.log(`Here we created a candidate with id: ${candidate._id}`);
    } else {
      res
        .status(400)
        .json({ Message: "Data entered by candidate is not valid" });
      return;
    }
  }
);
//Deleting a candidate from the portal
export const deleteCandidate = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const candidate = await Candidate.findById(req.params.id);
    if (!candidate) {
      res.status(400);
      throw new Error("Such candidate do not exists in our database");
    }
    await Candidate.deleteOne({ _id: candidate._id });
    res
      .status(200)
      .json(
        `Candidate ${candidate.firstName} ${candidate.lastName} has been deleted`
      );
  }
);
//Login feature for candidate

export const candidateLogin = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      res.status(400);
      throw new Error("All fields are mandatory for job seeker to login");
    }

    // Find candidate by email
    const candidate = await Candidate.findOne({ email });

    if (!candidate) {
      res.status(404).json({ Message: "Candidate not found" });
    }
    // Check password
    if (candidate && (await bcrypt.compare(password, candidate.password))) {
      if (!SECRET_ACCESS_TOKEN) {
        res.status(500);
        throw new Error(
          "Internal server error: SECRET_ACCESS_TOKEN is not defined"
        );
      }

      // Generate access token
      const accessToken = jwt.sign(
        {
          candidate: {
            email: candidate.email,
            id: candidate.id,
            role: "candidate",
            
          },
        },
        SECRET_ACCESS_TOKEN,
        { expiresIn: "3m" }
      );

      // Return the token and user information
      res.status(200).json({
        accessToken,
        candidate: {
          email: candidate.email,
          id: candidate.id,
          role: "candidate",
          firstName: candidate.firstName,
          lastName: candidate.lastName,
          photo: candidate.photo,
          username:candidate.username
        },
      });
    } else {
      res.status(401).json({ Message: "Invalid email or pass" });
      return;
    }
  }
);
