import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import { configDotenv } from "dotenv";
import expressAsyncHandler from "express-async-handler";

configDotenv();

interface JwtPayload {
    email:String,
    password:String
}

const validateToken = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    let token: string | undefined;
    let authHeader = req.headers.authorization || req.headers.Authorization;

    if (authHeader && typeof authHeader === "string" && authHeader.startsWith("Bearer")) {
      token = authHeader.split(" ")[1];

      try {
        const decoded = jwt.verify(token, process.env.SECRET_ACCESS_TOKEN as string) as JwtPayload;
        console.log(decoded);

        next();
      } catch (error) {
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