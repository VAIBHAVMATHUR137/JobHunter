import { body, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";
import { RequestHandler } from "express";

export const recruiterValidationRules = [
  // Personal Information
  body("firstName").trim().notEmpty().withMessage("First name is required"),
  body("lastName").trim().notEmpty().withMessage("Last name is required"),
  body("title").trim().notEmpty().withMessage("Title is required"),
  body("one_liner_intro")
    .trim()
    .notEmpty()
    .withMessage("One liner introduction is required"),
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
    .isObject()
    .withMessage("Tenth standard education must be an object")
    .notEmpty()
    .withMessage("Tenth standard education is required"),
  body("tenth_standard_education.school_name")
    .notEmpty()
    .withMessage("School name is required"),
  body("tenth_standard_education.percentage_obtained")
    .isNumeric()
    .withMessage("Percentage must be a number"),
  body("tenth_standard_education.year_of_passing")
    .notEmpty()
    .withMessage("Year of passing is required"),
  body("tenth_standard_education.school_board")
    .notEmpty()
    .withMessage("School board is required"),

  body("twelth_standard_education")
    .isObject()
    .withMessage("Twelfth standard education must be an object")
    .notEmpty()
    .withMessage("Twelfth standard education is required"),
  body("twelth_standard_education.school_name")
    .notEmpty()
    .withMessage("School name is required"),
  body("twelth_standard_education.percentage_obtained")
    .isNumeric()
    .withMessage("Percentage must be a number"),
  body("twelth_standard_education.year_of_passing")
    .notEmpty()
    .withMessage("Year of passing is required"),
  body("twelth_standard_education.school_board")
    .notEmpty()
    .withMessage("School board is required"),

  // College Education
  body("college_education")
    .isArray()
    .withMessage("College education must be an array"),
  body("college_education.*.programme_name")
    .notEmpty()
    .withMessage("Programme name is required"),
  body("college_education.*.specialization")
    .notEmpty()
    .withMessage("Specialization is required"),
  body("college_education.*.college_name")
    .notEmpty()
    .withMessage("College name is required"),
  body("college_education.*.university_name")
    .notEmpty()
    .withMessage("University name is required"),
  body("college_education.*.cgpa")
    .isNumeric()
    .withMessage("CGPA must be a number"),
  body("college_education.*.duration")
    .isNumeric()
    .withMessage("Duration must be a number"),
  body("college_education.*.year_of_commencement")
    .notEmpty()
    .withMessage("Year of commencement is required"),
  body("college_education.*.year_of_conclusion")
    .notEmpty()
    .withMessage("Year of conclusion is required"),

  // Experience
  body("internship_experience")
    .isArray()
    .withMessage("Internship experience must be an array"),
  body("internship_experience.*.company")
    .notEmpty()
    .withMessage("Company name is required"),
  body("internship_experience.*.date_of_commencement")
    .notEmpty()
    .withMessage("Date of commencement is required"),
  body("internship_experience.*.date_of_conclusion")
    .notEmpty()
    .withMessage("Date of conclusion is required"),
  body("internship_experience.*.duration")
    .isNumeric()
    .withMessage("Duration must be a number"),
  body("internship_experience.*.roles_and_responsibilities")
    .notEmpty()
    .withMessage("Roles and responsibilities are required"),
  body("internship_experience.*.stipend")
    .notEmpty()
    .withMessage("Stipend information is required"),

  // Work Experience
  body("work_experience")
    .isArray()
    .withMessage("Work experience must be an array"),
  body("work_experience.*.company")
    .notEmpty()
    .withMessage("Company name is required"),
  body("work_experience.*.designation")
    .notEmpty()
    .withMessage("Designation is required"),
  body("work_experience.*.date_of_commencement")
    .notEmpty()
    .withMessage("Date of commencement is required"),
  body("work_experience.*.date_of_resignation")
    .notEmpty()
    .withMessage("Date of resignation is required"),
  body("work_experience.*.duration_of_service")
    .isNumeric()
    .withMessage("Duration of service must be a number"),
  body("work_experience.*.job_description")
    .notEmpty()
    .withMessage("Job description is required"),
  body("work_experience.*.annual_ctc")
    .isNumeric()
    .withMessage("Annual CTC must be a number"),

  // Current Job
  body("current_job")
    .isObject()
    .withMessage("Current job must be an object"),
  body("current_job.company")
    .notEmpty()
    .withMessage("Company name is required"),
  body("current_job.job_description")
    .notEmpty()
    .withMessage("Job description is required"),
  body("current_job.date_of_commencement")
    .notEmpty()
    .withMessage("Date of commencement is required"),
  body("current_job.current_role")
    .notEmpty()
    .withMessage("Current role is required"),
  body("current_job.years_of_experience")
    .isNumeric()
    .withMessage("Years of experience must be a number"),
  body("current_job.current_location")
    .notEmpty()
    .withMessage("Current location is required"),

  // Core Skills
  body("core_skills")
    .isArray()
    .withMessage("Core skills must be an array")
    .notEmpty()
    .withMessage("Core skills are required"),
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
