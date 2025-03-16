import Recruiter from "../schema/RecruiterSchema";
import { client } from "../index";
import { Request, Response, NextFunction } from "express";
import expressAsyncHandler from "express-async-handler";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

import RecruiterUserName from "../schema/RecruiterUserNameSchema";


dotenv.config();
const SECRET_ACCESS_TOKEN = process.env.SECRET_ACCESS_TOKEN;

//Fetching a particular recruiter, registered at the portal
export const fetchIndividualRecruiter = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const { username } = req.params; // Get username from request parameters

    if (!username) {
      res.status(400).json({ message: "Username is required" });
      return;
    }
    const recruiter = await Recruiter.findOne({ username });
    if (!recruiter) {
      res.status(404).json({ message: "Recruiter not found" });
      return;
    }
    res.status(200).json(recruiter);
  }
);
//Registartion by a recruiter at portal
export const createRecruiter = expressAsyncHandler(
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

    //HERE WE ARE CHECKING IF RECRUITER WITH SAME USERNAME EXISTS OR NOT
    const existingRecruiter = await Recruiter.findOne({
      username,
    });

    if (existingRecruiter) {
      res.status(409).json({
        message: "Recruiter already exists",
      });
      return;
    }
    //HERE WE ARE USING HASHED PASSWORD
    const hashedPassword = await bcrypt.hash(password, 8);

    try {
      const recruiter = await Recruiter.create({
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
      if (recruiter) {
        res.status(201).json(recruiter);
      }
    } catch (error) {
      console.log(error);
    }
  }
);

//deleting a recruiter at portal
export const deleteRecruiter = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const { username } = req.params;

    // Check if the recruiter exists
    const recruiter = await Recruiter.findOne({ username });
    if (!recruiter) {
      res
        .status(400)
        .json({ message: "No such recruiter exists in our database" });
      return;
    }

    await Promise.all([
      Recruiter.deleteOne({ username }), // Delete from Recruiter collection
      RecruiterUserName.deleteOne({ username }), // Delete from RecruiterUserName collection
    ]);

    res.status(200).json({ message: "Recruiter deleted successfully" });
  }
);

//login feature for recruiter with refresh token
export const recruiterLogin = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const { username, password } = req.body;

    // Input validation
    if (!username || !password) {
      res.status(401).json({ Message: "All fields are mandatory" });
      return;
    }

    const recruiter = await Recruiter.findOne({ username });

    if (!recruiter) {
      res.status(404).json({ Message: "Recruiter not found" });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, recruiter.password);
    if (!isPasswordValid) {
      res.status(401).json({ Message: "Invalid Password" });
      return;
    }

    // Generate access and refresh tokens
    const accessToken = jwt.sign(
      {
        recruiter: {
          username: recruiter.username,
          id: recruiter.id,
          role: "recruiter",
        },
      },
      process.env.SECRET_ACCESS_TOKEN!,
      { expiresIn: "3m" }
    );

    const refreshToken = jwt.sign(
      { username: recruiter.username, id: recruiter.id },
      process.env.SECRET_REFRESH_TOKEN!,
      { expiresIn: "30d" }
    );

    await client.set(
      `Recruiter_${recruiter.username}_Refresh Token`,
      refreshToken
    );
    await client.set(
      `Recruiter_${recruiter.username}_Access Token`,
      accessToken
    );

    // Send tokens in the response body only
    res.status(200).json({
      accessToken,
      refreshToken,
      recruiter: {
        id: recruiter.id,
        role: "recruiter",
        firstName: recruiter.firstName,
        lastName: recruiter.lastName,
        photo: recruiter.photo,
        username: recruiter.username,
      },
    });
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

      // Check if recruiter exists in DB
      const recruiter = await Recruiter.findOne({ username: decoded.username });
      if (!recruiter) {
        res.status(403);
        throw new Error("No such recruiter exists");
      }
      //Check if such refresh token exists in redis
      const existingRefreshToken = await client.get(
        `Recruiter_${recruiter.username}_Refresh Token`
      );
      if (existingRefreshToken !== refreshToken) {
        res.status(403);
        throw new Error("Invalid refresh token");
      }

      // Generate new access token
      const newAccessToken = jwt.sign(
        {
          recruiter: {
            username: recruiter.username,
            id: recruiter.id,
            role: "recruiter",
          },
        },
        process.env.SECRET_ACCESS_TOKEN!,
        { expiresIn: "3m" }
      );

      // Optionally generate a new refresh token
      const newRefreshToken = jwt.sign(
        { username: recruiter.username, id: recruiter.id },
        process.env.SECRET_REFRESH_TOKEN!,
        { expiresIn: "30d" }
      );
      // Save the new refresh token in DB (optional rotation)
      await client.set(`Recruiter_${recruiter.username}_Refresh Token`, newRefreshToken);
      await client.set(`Recruiter_${recruiter.username}_Access Token`, newAccessToken);
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
