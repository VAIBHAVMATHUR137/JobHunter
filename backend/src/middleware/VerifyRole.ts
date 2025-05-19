import { Request, Response, NextFunction } from "express";
export enum Role {
  Candidate = "candidate",
  Recruiter = "recruiter",
}
export const verifyRole = (allowedRoles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ message: "User info not found on request" });
      return;
    }
    if (!allowedRoles.includes(req.user.role as Role)) {
      res.status(403).json({ message: "Access forbidden: insufficient role" });
      return;
    }
    next();
  };
};
