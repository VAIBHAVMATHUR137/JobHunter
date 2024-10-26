import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import { configDotenv } from "dotenv";
import expressAsyncHandler from "express-async-handler";

configDotenv();


interface CandidatePayload {
  candidate: {
    email: string;
    id: string;
    role: 'candidate';
  };
}

interface RecruiterPayload {
  recruiter: {
    email: string;
    id: string;
    role: 'recruiter';
  };
}

type JwtPayload = CandidatePayload | RecruiterPayload;

// Extend Request type to include user information
declare global {
  namespace Express {
    interface Request {
      user?: {
        email: string;
        id: string;
        role: 'candidate' | 'recruiter';
      };
    }
  }
}

const validateToken = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    let token: string | undefined;
    let authHeader = req.headers.authorization || req.headers.Authorization;

    if (authHeader && typeof authHeader === "string" && authHeader.startsWith("Bearer")) {
      token = authHeader.split(" ")[1];

      try {
        const decoded = jwt.verify(
          token, 
          process.env.SECRET_ACCESS_TOKEN as string
        ) as JwtPayload;

        // Determine if it's a candidate or recruiter and set user info
        if ('candidate' in decoded) {
          req.user = {
            email: decoded.candidate.email,
            id: decoded.candidate.id,
            role: 'candidate'
          };
        } else if ('recruiter' in decoded) {
          req.user = {
            email: decoded.recruiter.email,
            id: decoded.recruiter.id,
            role: 'recruiter'
          };
        } else {
          res.status(401);
          throw new Error("Invalid token payload");
        }

        next();
      } catch (error) {
        console.log(error);
        res.status(401);
        throw new Error("User not authorized");
      }
    } else {
      res.status(401);
      throw new Error("Authorization token is missing");
    }
  }
);

export default validateToken;