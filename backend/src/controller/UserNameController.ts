
import UserName from "../schema/UserNameSchema";
import { Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";

// Helper function to check username existence
const checkUsernameExists = async (username: string) => {
  const existingUsername = await UserName.findOne({ username });
  return existingUsername !== null;
};

export const createUniqueUserName = expressAsyncHandler(
  async (req: Request, res: Response) => {
    let { username } = req.body;
    try {
      // Check if username exists
      const exists = await checkUsernameExists(username);
      if (exists) {
        res.status(409).json({"message":"username already exists"});
        
      }

      // Create new username
      const newUser = await UserName.create({ username });
      res.status(201).json({ message: "Username generated successfully" });
      console.log(`Created username: ${newUser.username}`);
    } catch (error) {
      console.error(error);
      if (!res.statusCode || res.statusCode === 200) {
        res.status(500);
      }
      throw error;
    }
  }
);

export const searchUserName = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const { username } = req.body;
    const exists = await checkUsernameExists(username);

    if (exists) {
      console.log("Username exists: Message from backend");
      res.status(409).json({"message":"username already exists"});;
      
    }

    res.status(200).json({ message: "Username is available" });
  }
);
