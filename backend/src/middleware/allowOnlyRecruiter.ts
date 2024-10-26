import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import { configDotenv } from "dotenv";
import expressAsyncHandler from "express-async-handler";
export const allowOnlyRecruiter = (req: Request, res: Response, next: NextFunction) => {
    if (req.user?.role !== "recruiter") {
      res.status(403);
      throw new Error("Access denied: Recruiters only");
    }
    next();
  };
  