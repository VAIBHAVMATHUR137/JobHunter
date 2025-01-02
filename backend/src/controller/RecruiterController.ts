import Recruiter from "../schema/RecruiterSchema";
import { client } from "../index";
import { Request, Response, NextFunction } from "express";
import expressAsyncHandler from "express-async-handler";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

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
      firstName,
      lastName,
      number,
      email,
      password,
      company,
      location,
      photo,
      username,
    } = req.body;
    if (
      !firstName ||
      !lastName ||
      !number ||
      !email ||
      !password ||
      !company ||
      !location ||
      !photo ||
      !username
    ) {
      res.status(400).json({ Message: "All fields are mandatory" });
    }
    // Check if a recruiter with the same email or number already exists
    const existingRecruiter = await Recruiter.findOne({
      $or: [{ email }, { number }],
    });

    if (existingRecruiter) {
      res.status(409).json({
        message: "Recruiter with this email or number already exists",
      });
      return;
    }
    const hashedPassword = await bcrypt.hash(password, 8);
    console.log("Hashed Password", hashedPassword);
    const recruiter = await Recruiter.create({
      firstName,
      lastName,
      number,
      email,
      password: hashedPassword,
      company,
      location,
      photo,
      username,
    });

    if (recruiter) {
      res.status(201).json(recruiter);
    } else {
      res
        .status(400)
        .json({ Message: "Data entered here is not in proper form" });
      return;
    }
  }
);
//deleting a recruiter at portal
export const deleteRecruiter = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const recruiter = await Recruiter.findById(req.params.id);
    if (!recruiter) {
      res.status(400);
      throw new Error("No such recruiter exists you wanna delete");
    }
    await Recruiter.deleteOne({ _id: recruiter._id });
    res.status(200).json(`Recruiter ${recruiter.firstName} has been deleted`);
  }
);
//login feature for recruiter with refresh token

export const recruiterLogin = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    // Input validation
    if (!email || !password) {
      res.status(401);
      throw new Error("All fields are mandatory");
    }

    const recruiter = await Recruiter.findOne({ email });
    if (!recruiter) {
      res.status(404);
      throw new Error("Recruiter not found");
    }

    const isPasswordValid = await bcrypt.compare(password, recruiter.password);
    if (!isPasswordValid) {
      res.status(401);
      throw new Error("Invalid credentials");
    }

    // Generate access and refresh tokens
    const accessToken = jwt.sign(
      {
        recruiter: {
          email: recruiter.email,
          id: recruiter.id,
          role: "recruiter",
        },
      },
      process.env.SECRET_ACCESS_TOKEN!,
      { expiresIn: "3m" }
    );

    const refreshToken = jwt.sign(
      { email: recruiter.email, id: recruiter.id },
      process.env.SECRET_REFRESH_TOKEN!,
      { expiresIn: "30d" }
    );

    await client.set(`${recruiter.email}_Refresh Token`, refreshToken);
    await client.set(`${recruiter.email}_Access Token`, accessToken);

    // Send tokens in the response body only
    res.status(200).json({
      accessToken,
      refreshToken,
      recruiter: {
        email: recruiter.email,
        id: recruiter.id,
        role: "recruiter",
        firstName: recruiter.firstName,
        lastName: recruiter.lastName,
        photo: recruiter.photo,
        username: recruiter.username
      },
    });
    console.log(accessToken, refreshToken,recruiter.username);
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
      ) as { email: string; id: string };

      // Check if recruiter exists in DB
      const recruiter = await Recruiter.findOne({ email: decoded.email });
      if (!recruiter) {
        res.status(403);
        throw new Error("No such recruiter exists");
      }
      //Check if such refresh token exists in redis
      const existingRefreshToken = await client.get(
        `${recruiter.email}_Refresh Token`
      );
      if (existingRefreshToken !== refreshToken) {
        res.status(403);
        throw new Error("Invalid refresh token");
      }

      // Generate new access token
      const newAccessToken = jwt.sign(
        {
          recruiter: {
            email: recruiter.email,
            id: recruiter.id,
            role: "recruiter",
          },
        },
        process.env.SECRET_ACCESS_TOKEN!,
        { expiresIn: "3m" }
      );

      // Optionally generate a new refresh token
      const newRefreshToken = jwt.sign(
        { email: recruiter.email, id: recruiter.id },
        process.env.SECRET_REFRESH_TOKEN!,
        { expiresIn: "30d" }
      );

      // Save the new refresh token in DB (optional rotation)
      await client.set(`${recruiter.email}_Refresh Token`, newRefreshToken);

      await client.set(`${recruiter.email}_Access Token`, newAccessToken);

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
