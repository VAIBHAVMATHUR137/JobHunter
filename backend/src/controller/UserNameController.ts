import CandidateUserName from "../schema/CandidateUserNameSchema";
import RecruiterUserName from "../schema/RecruiterUserNameSchema";

import { Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import { Model } from "mongoose";
import bcrypt from "bcrypt";

//FUNCTION TO SEARCH USERNAME IN DATABASE.PURPOSE IS TO CHECK AVAILABILITY OF USERNAME WHILE GENERATING IT AT THE TIME OF REGISTRATION
export const searchUserName = <T extends RecruiterUserName | CandidateUserName>(
  primaryModel: Model<T>,
  optionalModel?: Model<T>
) =>
  expressAsyncHandler(async (req: Request, res: Response) => {
    const { username } = req.body;

    //SEARCH IN THE PRIMARY DATABASE
    const userExistsInPrimaryDB = await primaryModel.findOne({ username });

    // IF PROVIDED, SEARCH IN THE OPTIONAL DATABASE
    const userExistsInOptionalDB = optionalModel
      ? await optionalModel.findOne({ username })
      : null;

    if (userExistsInPrimaryDB || userExistsInOptionalDB) {
      res.status(409).json({ message: "Username already exists" });
      return;
    }

    res.status(200).json({ message: "Username is available" });
  });

//FUNCTION TO CREATE USERNAME IN ANY DATABASE (PASS THE NAME OF DATABASE AS PARAM)
export const createUniqueUserName = <
  T extends RecruiterUserName | CandidateUserName
>(
  model: Model<T>
) =>
  expressAsyncHandler(async (req: Request, res: Response) => {
    const { username, password } = req.body;
    const hashed_password = await bcrypt.hash(password, 8);
    if (!username) {
      res.status(400).json({ message: "Username is required" });
      return;
    }
    if (!password) {
      res.status(400).json({ message: "Password is Mandatory" });
      return;
    }
    const existingUser = await model.findOne({ username });
    if (existingUser) {
      res.status(409).json({ message: "Username already exists" });
      return;
    } else {
      // Create new username
      try {
        const user = await model.create({
          username,
          password: hashed_password,
        });

        res.status(201).json({
          message: "Username created successfully"
        });
      } catch (error) {
        if (!res.statusCode || res.statusCode === 200) {
          res.status(500);
        }
      }
    }
  });
