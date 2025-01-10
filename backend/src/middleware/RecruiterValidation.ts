import { body, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";
import { RequestHandler } from "express";

export const recruiterValidationRules = [
  // Personal Information
  body("firstName").trim().notEmpty().withMessage("First name is required"),
  body("lastName").trim().notEmpty().withMessage("Last name is required"),
  body("number")
    .matches(/^(\+\d{1,3}[- ]?)?\d{10}$/)
    .withMessage("Please enter a valid mobile number"),
  body("email")
    .isEmail()
    .withMessage("Please enter a valid email")
    .normalizeEmail(),
  body("username")
    .trim()
    .notEmpty()
    .withMessage("Username is required")
    .isLength({ min: 3 })
    .withMessage("Username must be at least 3 characters long"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  body("gender")
    .isIn(["male", "female", "transgender"])
    .withMessage("Please select a valid gender"),
  body("introduction")
    .trim()
    .notEmpty()
    .withMessage("Introduction is required"),
  body("photo")
    .trim()
    .notEmpty()
    .withMessage("Photo URL is required")
    .isURL()
    .withMessage("Please provide a valid photo URL"),

  // Education
  body("tenth_standard_education")
    .isArray()
    .withMessage("Tenth standard education must be an array")
    .notEmpty()
    .withMessage("Tenth standard education is required"),
  body("twelth_standard_education")
    .isArray()
    .withMessage("Twelfth standard education must be an array")
    .notEmpty()
    .withMessage("Twelfth standard education is required"),
  body("college_education")
    .isArray()
    .withMessage("College education must be an array")
    .notEmpty()
    .withMessage("College education is required"),

  // Experience
  body("internship_experience")
    .isArray()
    .withMessage("Internship experience must be an array")
    .notEmpty()
    .withMessage("Internship experience is required"),
  body("work_experience")
    .isArray()
    .withMessage("Work experience must be an array")
    .notEmpty()
    .withMessage("Work experience is required"),

  // Skills and Current Status
  body("core_skills")
    .isArray()
    .withMessage("Core skills must be an array")
    .notEmpty()
    .withMessage("Core skills are required"),
  body("current_job")
    .isArray()
    .withMessage("Current job must be an array")
    .notEmpty()
    .withMessage("Current job details are required"),
  body("current_location")
    .trim()
    .notEmpty()
    .withMessage("Current location is required"),

  // Social Media
  body("linkedin")
    .trim()
    .notEmpty()
    .withMessage("LinkedIn profile is required")
    .isURL()
    .withMessage("Please provide a valid LinkedIn URL"),
  body("X")
    .trim()
    .notEmpty()
    .withMessage("X (Twitter) profile is required")
    .isURL()
    .withMessage("Please provide a valid X (Twitter) URL"),
  body("date_of_birth")
    .notEmpty()
    .withMessage("Date of birth is required")
    .isISO8601()
    .withMessage("Please provide a valid date")
    .custom((value) => {
      const dob = new Date(value);
      const today = new Date();
      const age = today.getFullYear() - dob.getFullYear();

      // Check if date is not in future
      if (dob > today) {
        throw new Error("Date of birth cannot be in the future");
      }

      // Ensure recruiter is at least 18 years old
      if (age < 18) {
        throw new Error("Recruiter must be at least 18 years old");
      }

      // Reasonable maximum age check (e.g., 100 years)
      if (age > 100) {
        throw new Error("Please provide a valid date of birth");
      }
      return true;
    }),
];

// Fixed middleware with correct typing
export const validateRecruiter: RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }
  next();
};

// Login validation rules
export const loginValidationRules = [
  body("username").trim().notEmpty().withMessage("Username is required"),
  body("password").notEmpty().withMessage("Password is required"),
];

// Refresh token validation rules
export const refreshTokenValidationRules = [
  body("refreshToken").notEmpty().withMessage("Refresh token is required"),
];
