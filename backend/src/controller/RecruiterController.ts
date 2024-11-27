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
//login feature for recruiter
export const recruiterLogin = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400);
      throw new Error("All fields are mandatory for recruiter to login");
    }
    const recruiter = await Recruiter.findOne({ email });
    //handle the error in which during login, email was not found
    if (!recruiter) {
      res.status(404).json({ Message: "Recruiter not found" });
    }

    if (recruiter && (await bcrypt.compare(password, recruiter.password))) {
      if (!SECRET_ACCESS_TOKEN) {
        res.status(500);
        throw new Error(
          "Internal server error: SECRET_ACCESS_TOKEN is not defined"
        );
      }
      //create access token for JWT to verify
      const accessToken = jwt.sign(
        {
          recruiter: {
            email: recruiter.email,
            id: recruiter.id,
            role: "recruiter",
          },
        },
        SECRET_ACCESS_TOKEN,
        { expiresIn: "15m" }
      );
      res.status(200).json({
        accessToken,
        recruiter: {
          email: recruiter.email,
          id: recruiter.id,
          role: "recruiter",
        },
      });
    } else {
      res.status(401).json({"Message":"Invalid email or pass"});
      return;
    }
  }
);
