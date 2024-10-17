import Recruiter from "../schema/RecruiterSchema";
import Login from "../schema/LoginSchema";
import { Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
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
    const recruiter = await Recruiter.create({
      name,
      number,
      email,
      password,
      company,
      location,
    });
    res.status(200).json(recruiter);
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
  }
);
//login feature for recruiter
export const recruiterLogin = expressAsyncHandler(
  async (req: Request, res: Response) => {
    res
      .status(200)
      .json({ Message: "Login API for recruiter is running fine" });
  }
);
