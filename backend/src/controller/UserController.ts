import { client } from "../index";
import { Request, Response, NextFunction, response } from "express";
import expressAsyncHandler from "express-async-handler";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

import { Model } from "mongoose";
import { JobApplicationSchema } from "../schema/JobApplicationSchema";

dotenv.config();
const SECRET_ACCESS_TOKEN = process.env.SECRET_ACCESS_TOKEN;
type UserRole = 'candidate' | 'recruiter';

//FETCH DASHBOARD OF BOTH CANDIDATE AND RECRUITER
export const userDashboard = <T>(database: Model<T>) =>
  expressAsyncHandler(async (req: Request, res: Response) => {
    try {
      const username = req.user?.username;
      if (!username) {
        res.status(401).json({ Message: "Authentication required" });
        return;
      }
      const userData = await database.findOne({ username });
      if (!userData) {
        res.status(404).json({ Message: `${username} not found` });
        return;
      }
      res.status(200).json(userData);
    } catch (error) {
      console.log(error);
      res.status(500).json({ Message: "Error fetching users" });
      return;
    }
  });
//FETCH ALL RECRUITERS OR ALL CANDIDATES
export const fetchAllUsers = <T>(database: Model<T>) =>
  expressAsyncHandler(async (req: Request, res: Response) => {
    try {
      const allUsers = await database.find();
      res.status(200).json(allUsers);
      return;
    } catch (error) {
      console.log(error);
      res.status(500).json({ Message: "Error fetching users" });
      return;
    }
  });
//FETCH INDIVIDUAL USER
export const getProfile = <T>(database: Model<T>) =>
  expressAsyncHandler(async (req: Request, res: Response) => {
    try {
      const { username } = req.params;
      if (!username) {
        res.status(400).json({ message: "Username is required" });
        return;
      }
      const user = await database.findOne({ username });
      if (!user) {
        res.status(404).json({ Message: `User not found` });
        return;
      }
      res.status(200).json(user);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Something went wrong on the server." });
      return;
    }
  });

//CREATE USER
export const createUser = <T>(database: Model<T>) =>
  expressAsyncHandler(async (req: Request, res: Response) => {
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
    //Now we check if the same user exists or not
    const existingUser = await database.findOne({ username });
    if (existingUser) {
      res.status(409).json({ Message: "No such user exists" });
      return;
    }
    //HERE WE ARE USING HASHED PASSWORD
    const hashedPassword = await bcrypt.hash(password, 8);
    try {
      const user = await database.create({
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
      if (user) {
        res.status(201).json({ Message: "User registered successfully !" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Something went wrong on the server." });
      return;
    }
  });
//FUNCTION TO DELETE USER
export const deleteUser = <T, U,V>(
  userDatabase: Model<T>,
  usernameDatabase: Model<U>,
  jobApplicationDatabase:Model<V>
) =>
  expressAsyncHandler(async (req: Request, res: Response) => {
    const { username } = req.params;
    const user = await userDatabase.findOne({ username });
    if (!user) {
      res.status(400).json({ Message: "No such user exists" });
      return;
    }
    try {
      await Promise.all([
        userDatabase.deleteOne({ username }),
        usernameDatabase.deleteOne({ username }),
        
      ]);
      res.status(200).json({ Message: "User deleted successfully" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ Message: "Cannot delete the user" });
    }
  });

// this separate `userDB` interface is necessary because the reusable controller function isn't affiliated with any specific schema (recruiter or candidate) at this moment. It's a way to tell TypeScript "any model that has at least these properties can be used with this function."
interface UserDB {
  username: string;
  password: string;
  photo?: string;
  id?: string;
}

//FUNCTION FOR USER LOGIN
export const userLogin = <T extends UserDB>(
  model: Model<T>,
  role: UserRole
) => expressAsyncHandler(async (req: Request, res: Response) => {
  const { username, password } = req.body;

  // Input validation
  if (!username || !password) {
    res.status(401).json({ message: "All fields are mandatory" });
    return;
  }

  // Find user in database
  const user = await model.findOne({ username });
  const userRole=`${role.charAt(0).toUpperCase()+role.slice(1)}`
  if (!user) {
    res.status(404).json({ message: `${role.charAt(0).toUpperCase() + role.slice(1)} not found` });
    return;
  }

  // Validate password
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    res.status(401).json({ message: "Invalid password" });
    return;
  }

  // Create token payload matching the expected structure in validateToken.ts
  const tokenPayload = {
    [role]: {
      username: user.username,
      id: user.id,
      role: role
   
    }
  };

  // Generate tokens
  const accessToken = jwt.sign(
    tokenPayload,
    process.env.SECRET_ACCESS_TOKEN!,
    { expiresIn: "3m" }
  );

  const refreshToken = jwt.sign(
    { username: user.username, id: user.id },
    process.env.SECRET_REFRESH_TOKEN!,
    { expiresIn: "30d" }
  );

  // Store tokens in Redis
  const modelName = model.modelName || role.charAt(0).toUpperCase() + role.slice(1);
  await client.set(
    `${modelName}_${user.username}_Refresh_Token`,
    refreshToken
  );

  await client.set(
    `${modelName}_${user.username}_Access_Token`,
    accessToken
  );
  client.set('key', 'value');
client.get('key').then(console.log); // Should print 'value'

  // Prepare response
  const responseData = {
    accessToken,
    refreshToken,
    [role]: {
      id: user.id,
      photo: user.photo,
      username: user.username,
    },
  };

  res.status(200).json(responseData);
});



// USER LOGOUT FUNCTION
export const userLogout = <T extends UserDB>(model: Model<T>, role: UserRole) =>
  expressAsyncHandler(async (req: Request, res: Response) => {
    // Get username from authenticated user (from token) rather than requiring it in body
    const username = req.user?.username;
    
    if (!username) {
      res.status(401).json({ message: "Authentication required" });
      return;
    }
    
    try {
      const modelName = model.modelName || role.charAt(0).toUpperCase() + role.slice(1);
  
      await Promise.all([
        client.del(`${modelName}_${username}_Refresh_Token`),
        client.del(`${modelName}_${username}_Access_Token`),
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
  });

// FUNCTION FOR UPDATING ACCESS TOKEN
export const updateToken = <T extends UserDB>(model: Model<T>, role: UserRole) =>
  expressAsyncHandler(async (req: Request, res: Response) => {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
      res.status(401).json({ message: "Refresh token not provided" });
      return;
    }
    
    try {
      // Verify refresh token
      const decoded = jwt.verify(
        refreshToken,
        process.env.SECRET_REFRESH_TOKEN!
      ) as { username: string; id: string };

      const user = await model.findOne({ username: decoded.username });
      
      if (!user) {
        res.status(403).json({ message: "User not found" });
        return;
      }

      // Use consistent naming for Redis keys
      const modelName = model.modelName || role.charAt(0).toUpperCase() + role.slice(1);
      const storedRefreshToken = await client.get(
        `${modelName}_${user.username}_Refresh_Token`
      );
      
      if (storedRefreshToken !== refreshToken) {
        res.status(403).json({ message: "Invalid refresh token" });
        return;
      }

      // Create token payload matching the expected structure in validateToken.ts
      const tokenPayload = {
        [role]: {
          username: user.username,
          id: user.id,
          role: role
        }
      };

      // Generate new access token
      const newAccessToken = jwt.sign(
        tokenPayload,
        process.env.SECRET_ACCESS_TOKEN!,
        { expiresIn: "3m" }
      );

      // Optionally generating new Refresh Token for token rotation
      const newRefreshToken = jwt.sign(
        { username: user.username, id: user.id },
        process.env.SECRET_REFRESH_TOKEN!, // Using correct refresh token secret
        { expiresIn: "30d" }
      );

      // Update tokens in Redis
      await client.set(
        `${modelName}_${user.username}_Refresh_Token`,
        newRefreshToken
      );
      await client.set(
        `${modelName}_${user.username}_Access_Token`,
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
  });