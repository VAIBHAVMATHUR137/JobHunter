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
      res.status(400);
      throw new Error("No such recruiter exists");
    }
    res.status(200).json({ Message: `Welcome recruiter ${req.body.name}` });
  }
);
//Registartion by a recruiter at portal
export const createRecruiter = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const { name, number, email, password, company, location } = req.body;
    if (!name || !number || !email || !password || !company || !location) {
      throw new Error("All fields are mandatory");
    }

    const hashedPassword = await bcrypt.hash(password, 8);
    console.log("Hashed Password", hashedPassword);

    const recruiter = await Recruiter.create({
      name,
      number,
      email,
      password:hashedPassword,
      company,
      location,
    });
    console.log(`Here we created a recruiter ${recruiter.name}`);
    if (recruiter) {
      res.status(201).json(recruiter);
    } else {
      res.status(400);
      throw new Error("Data entered by candidate is not valid");
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
             role:'recruiter'
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
          role:'recruiter'
        },
      });
    } else {
      res.status(401);
      throw new Error("INvalid email or password");
    }
  }
);
