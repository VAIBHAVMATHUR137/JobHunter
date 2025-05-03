import { body, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";
import { RequestHandler } from "express";

export const jobPostingValidationRules = [
  // Job Details
  body("designation")
    .trim()
    .notEmpty()
    .withMessage("Designation is required"),
  
  body("job_role")
    .trim()
    .notEmpty()
    .withMessage("Job role is required"),
  
  // CTC Validation
  body("CTC")
    .isObject()
    .withMessage("CTC must be an object")
    .notEmpty()
    .withMessage("CTC is required"),
  
  body("CTC.minCTC")
    .isNumeric()
    .withMessage("Minimum CTC must be a number")
    .custom((value, { req }) => {
      if (value < 0) {
        throw new Error("Minimum CTC cannot be negative");
      }
      return true;
    }),
  
  body("CTC.maxCTC")
    .isNumeric()
    .withMessage("Maximum CTC must be a number")
    .custom((value, { req }) => {
      if (value < 0) {
        throw new Error("Maximum CTC cannot be negative");
      }
      if (req.body.CTC && value < req.body.CTC.minCTC) {
        throw new Error("Maximum CTC cannot be less than minimum CTC");
      }
      return true;
    }),
  
  // Experience Requirements
  body("experience_required_in_months")
    .trim()
    .notEmpty()
    .withMessage("Experience requirement is required"),
  
  body("fresher_eligible")
    .isBoolean()
    .withMessage("Fresher eligibility must be a boolean value"),
  
  // Education Requirements
  body("degree_required")
    .isArray()
    .withMessage("Degree required must be an array")
    .notEmpty()
    .withMessage("At least one degree must be specified"),
  
  body("bond")
    .trim()
    .notEmpty()
    .withMessage("Bond information is required"),
  
  // Job Location and Environment
  body("work_environment")
    .trim()
    .notEmpty()
    .withMessage("Work environment is required")
    .isIn(["Remote", "Hybrid", "On-site"])
    .withMessage("Work environment must be either Remote, Hybrid, or On-site"),
  
  body("job_location")
    .trim()
    .notEmpty()
    .withMessage("Job location is required"),
  
  // Company Information
  body("company_name")
    .trim()
    .notEmpty()
    .withMessage("Company name is required"),
  
  // Skills and Requirements
  body("skills_required")
    .isArray()
    .withMessage("Skills required must be an array")
    .notEmpty()
    .withMessage("At least one skill must be specified"),
  
  body("type_of_employment")
    .trim()
    .notEmpty()
    .withMessage("Type of employment is required")
    .isIn(["Full-time", "Part-time", "Contract-based", "Project-based", "Internship"])
    .withMessage("Type of employment must be valid"),
  
  body("perks_and_benefits")
    .trim()
    .notEmpty()
    .withMessage("Perks and benefits are required"),
  
  body("required_languages")
    .isArray()
    .withMessage("Required languages must be an array")
    .notEmpty()
    .withMessage("At least one language must be specified"),
  
  body("visa_sponsorship_available")
    .isBoolean()
    .withMessage("Visa sponsorship availability must be a boolean value"),
  
  body("username")
    .trim()
    .notEmpty()
    .withMessage("Username is required")
];

// Validate job posting middleware
export const validateJobPosting: RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }
  next();
};

// Custom business logic validation middleware
export const validateJobPostingBusinessLogic: RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { fresher_eligible, experience_required_in_months } = req.body;
  
  // Validate fresher eligibility logic
  if (fresher_eligible === true && parseInt(experience_required_in_months) > 0) {
    res.status(400).json({
      error: "Inconsistent data: Job cannot be fresher eligible and require experience at the same time"
    });
    return;
  }
  

  
  next();
};

// Job posting search validation
export const jobSearchValidationRules = [
  body("skills").optional().isArray().withMessage("Skills must be an array"),
  body("location").optional().isString().withMessage("Location must be a string"),
  body("minCTC").optional().isNumeric().withMessage("Minimum CTC must be a number"),
  body("maxCTC").optional().isNumeric().withMessage("Maximum CTC must be a number"),
  body("type_of_employment").optional().isIn(["Full-time", "Part-time", "Contract-based", "Project-based", "Internship"]).withMessage("Invalid employment type"),
  body("work_environment").optional().isIn(["Remote", "Hybrid", "On-site"]).withMessage("Invalid work environment")
];