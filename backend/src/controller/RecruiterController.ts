import Recruiter from "../schema/RecruiterSchema";

import { Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
const SECRET_ACCESS_TOKEN = process.env.SECRET_ACCESS_TOKEN;

//Fetching a particular recruiter, registered at the portal
export const fetchIndividualRecruiter = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const recruiter = await Recruiter.findById(req.params.id);
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
    const { name, number, email, password, company, location, photo } =
      req.body;
    if (
      !name ||
      !number ||
      !email ||
      !password ||
      !company ||
      !location ||
      !photo
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
      name,
      number,
      email,
      password: hashedPassword,
      company,
      location,
      photo,
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
    res.status(200).json(`Recruiter ${recruiter.name} has been deleted`);
  }
);
//login feature for recruiter with refresh token

export const recruiterLogin = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    // Input validation
    if (!email || !password) {
      res
        .status(400)
        .json({ message: "All fields are mandatory for recruiter to login" });
      return; // Ensure no further execution
    }

    const recruiter = await Recruiter.findOne({ email });
    if (!recruiter) {
      res.status(404).json({ message: "Recruiter not found" });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, recruiter.password);
    if (!isPasswordValid) {
      res.status(401).json({ message: "Invalid email or password" });
      return;
    }

    // Generate tokens
    const accessToken = jwt.sign(
      {
        recruiter: {
          email: recruiter.email,
          id: recruiter.id,
          role: "recruiter",
        },
      },
      process.env.SECRET_ACCESS_TOKEN!,
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
      { email: recruiter.email, id: recruiter.id },
      process.env.SECRET_REFRESH_TOKEN!,
      { expiresIn: "30d" }
    );
    // const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);



    
    // recruiter.refreshToken = hashedRefreshToken;
    // await recruiter.save();


    recruiter.refreshToken = refreshToken;
    await recruiter.save();

    // Send response
    res.status(200).json({
      accessToken,
      refreshToken,
      recruiter: {
        email: recruiter.email,
        id: recruiter.id,
        role: "recruiter",
      },
    });
    console.log(refreshToken)

    return; // Explicitly return to match the expected type
  }
);

export const refreshToken = expressAsyncHandler(async (req: Request, res: Response) => {
  const { refreshToken } = req.body; 

  if (!refreshToken) {
     res.status(400).json({ message: "Refresh token is required" });
     return;
  }

  // Check if the refresh token exists in the database
  const recruiter = await Recruiter.findOne({ refreshToken });
  if (!recruiter) {
   res.status(403).json({ message: "Invalid refresh token" });
   return;
  }

  // Verify the refresh token
  try {
    const decoded = jwt.verify(refreshToken, process.env.SECRET_REFRESH_TOKEN!) as { id: string };

    // Generate a new access token
    const newAccessToken = jwt.sign(
      {
        recruiter: {
          id: recruiter.id,
          email: recruiter.email,
          role: "recruiter",
        },
      },
      process.env.SECRET_ACCESS_TOKEN!,
      { expiresIn: "15m" }
    );

    // Optional: Rotate the refresh token for security
    const newRefreshToken = jwt.sign(
      { id: recruiter.id, email: recruiter.email },
      process.env.SECRET_REFRESH_TOKEN!,
      { expiresIn: "7d" }
    );

    // Save the new refresh token in the database
    recruiter.refreshToken = newRefreshToken;
    await recruiter.save();

    // Respond with new tokens
    res.status(200).json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken, // Send this only if you're rotating tokens
    });
    console.log(newRefreshToken)
  } catch (error) {
    res.status(403).json({ message: "Invalid or expired refresh token" });
  }
});

