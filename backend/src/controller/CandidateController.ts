import Candidate from "../schema/CandidateSchema";
import CandidateUserName from "../schema/CandidateUserNameSchema";
import { Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { client } from "../index";

dotenv.config();
const SECRET_ACCESS_TOKEN = process.env.SECRET_ACCESS_TOKEN;

//Fetching a particular candidate, registered at the platform
export const fetchIndividualCandidate = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const { username } = req.params;

    if (!username) {
      res.status(400).json({ message: "Username is required" });
      return;
    }
    const candidate = await Candidate.findOne({ username });
    if (!candidate) {
      res.status(404).json({ message: "Candidate not found" });
      return;
    }
    res.status(200).json(candidate);
  }
);
//Registartion by a candidate at portal
export const createCandidate = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const {
      photo,
      firstName,
      lastName,
      title,
      one_liner_intro,
      email,
      password,
      username,
      gender,
      introduction,
      number,
      tenth_standard_education,
      twelth_standard_education,
      college_education,
      internship_experience,
      certificate_courses,
      work_experience,
      core_skills,
      current_job,
    } = req.body;

    //HERE WE ARE CHECKING IF Candidate WITH SAME USERNAME EXISTS OR NOT
    const existingCandidate = await Candidate.findOne({
      username,
    });

    if (existingCandidate) {
      res.status(409).json({
        message: "Candidate already exists",
      });
      return;
    }
    //HERE WE ARE USING HASHED PASSWORD
    const hashedPassword = await bcrypt.hash(password, 8);

    try {
      const candidate = await Candidate.create({
        photo,
        firstName,
        lastName,
        title,
        one_liner_intro,
        email,
        password: hashedPassword,
        username,
        gender,
        introduction,
        number,
        tenth_standard_education,
        twelth_standard_education,
        college_education,
        internship_experience,
        certificate_courses,
        work_experience,
        core_skills,
        current_job,
      });
      if (candidate) {
        res
          .status(201)
          .json({ Message: "Candidate registered successfully !" });
      }
    } catch (error) {
      console.log(error);
    }
  }
);
//Deleting a candidate from the portal
export const deleteCandidate = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const { username } = req.params;

    // Check if the Candidate exists
    const candidate = await Candidate.findOne({ username });
    if (!candidate) {
      res
        .status(400)
        .json({ message: "No such Candidate exists in our database" });
      return;
    }
    try {
      await Promise.all([
        Candidate.deleteOne({ username }),
        CandidateUserName.deleteOne({ username }),
      ]);

      res.status(200).json({ message: "Candidate deleted successfully" });
    } catch (error) {
      console.error("Error deleting Candidate:", error);
      res.status(500).json({
        message: "Delete operation for Candidate failed",
      });
      return;
    }
  }
);
//Login feature for candidate

export const candidateLogin = expressAsyncHandler(
  async (req: Request, res: Response) => {
    async (req: Request, res: Response) => {
      const { username, password } = req.body;

      // Input validation
      if (!username || !password) {
        res.status(401).json({ Message: "All fields are mandatory" });
        return;
      }

      const candidate = await Candidate.findOne({ username });

      if (!candidate) {
        res.status(404).json({ Message: "Candidate not found" });
        return;
      }

      const isPasswordValid = await bcrypt.compare(
        password,
        candidate.password
      );
      if (!isPasswordValid) {
        res.status(401).json({ Message: "Invalid Password" });
        return;
      }

      // Generate access and refresh tokens
      const accessToken = jwt.sign(
        {
          candidate: {
            username: candidate.username,
            id: candidate.id,
            role: "candidate",
          },
        },
        process.env.SECRET_ACCESS_TOKEN!,
        { expiresIn: "3m" }
      );

      const refreshToken = jwt.sign(
        { username: candidate.username, id: candidate.id },
        process.env.SECRET_REFRESH_TOKEN!,
        { expiresIn: "30d" }
      );

      await client.set(
        `Candidate_${candidate.username}_Refresh Token`,
        refreshToken
      );
      await client.set(
        `Candidate_${candidate.username}_Access Token`,
        accessToken
      );

      // Send tokens in the response body only
      res.status(200).json({
        accessToken,
        refreshToken,
        candidate: {
          id: candidate.id,
          photo: candidate.photo,
          username: candidate.username,
        },
      });
    };
  }
);

//Logout controller function
export const candidateLogout = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const { username } = req.body;

    if (!username) {
      res.status(400).json({ message: "Username is required" });
      return;
    }
    try {
      await Promise.all([
        client.del(`Candidate_${username}_Access Token`),
        client.del(`Candidate_${username}_Refresh Token`),
      ]);

      res.status(200).json({
        message: "Logout successful",
      });
    } catch (error) {
      console.error("Logout error:", error);
      res.status(500).json({
        message: "Error during logout process",
      });
    }
  }
);
export const refreshAccessToken = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      res.status(401);
      throw new Error("Refresh token not provided");
    }

    try {
      // Verify refresh token
      const decoded = jwt.verify(
        refreshToken,
        process.env.SECRET_REFRESH_TOKEN!
      ) as { username: string; id: string };

      // Check if Candidate exists in DB
      const candidate = await Candidate.findOne({ username: decoded.username });
      if (!candidate) {
        res.status(403);
        throw new Error("No such Candidate exists");
      }
      //Check if such refresh token exists in redis
      const existingRefreshToken = await client.get(
        `Candidate_${candidate.username}_Refresh Token`
      );
      if (existingRefreshToken !== refreshToken) {
        res.status(403);
        throw new Error("Invalid refresh token");
      }

      // Generate new access token
      const newAccessToken = jwt.sign(
        {
          candidate: {
            username: candidate.username,
            id: candidate.id,
            role: "candidate",
          },
        },
        process.env.SECRET_ACCESS_TOKEN!,
        { expiresIn: "3m" }
      );

      // Optionally generate a new refresh token
      const newRefreshToken = jwt.sign(
        { username: candidate.username, id: candidate.id },
        process.env.SECRET_REFRESH_TOKEN!,
        { expiresIn: "30d" }
      );
      // Save the new refresh token in DB (optional rotation)
      await client.set(
        `Candidate_${candidate.username}_Refresh Token`,
        newRefreshToken
      );
      await client.set(
        `Candidate_${candidate.username}_Access Token`,
        newAccessToken
      );
      // Send tokens in the response
      res.status(200).json({
        accessToken: newAccessToken,
        refreshToken: newRefreshToken, // Optional for rotation
      });
    } catch (error) {
      console.error("Error refreshing token:", error);
      res.status(403).json({ message: "Invalid or expired refresh token" });
    }
  }
);
