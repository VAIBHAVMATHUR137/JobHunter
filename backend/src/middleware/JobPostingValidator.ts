import { body, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";
import { RequestHandler } from "express";

export const jobPostingValidationRules = [
  // Job Details
  body("designation")
    .trim()
    .notEmpty()
    .withMessage("Designation is required"),
  

  
  // CTC Validation
  body("CTC")
    .isObject()
    .withMessage("CTC must be an object")
    .notEmpty()
    .withMessage("CTC is required"),
  
  body("CTC.minCTC")
    .isString()
    .withMessage("Minimum CTC must be a string")
    .notEmpty()
    .withMessage("Minimum CTC is required"),
  
  body("CTC.maxCTC")
    .isString()
    .withMessage("Maximum CTC must be a string")
    .notEmpty()
    .withMessage("Maximum CTC is required")
    .custom((value, { req }) => {
      const minCTC = parseFloat(req.body.CTC.minCTC);
      const maxCTC = parseFloat(value);
      if (isNaN(minCTC) || isNaN(maxCTC)) {
        throw new Error("CTC values must be valid numbers");
      }
      if (maxCTC < 0) {
        throw new Error("Maximum CTC cannot be negative");
      }
      if (maxCTC < minCTC) {
        throw new Error("Maximum CTC cannot be less than minimum CTC");
      }
      return true;
    }),
  
  // Experience Requirements
  body("experience_required_in_months")
    .trim()
    .notEmpty()
    .withMessage("Experience requirement is required"),
  
  body("isFresherEligible")
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
    .isArray()
    .withMessage("Job location must be an array")
    .notEmpty()
    .withMessage("At least one job location must be specified"),
  
  // Company Information
  body("company_name")
    .trim()
    .notEmpty()
    .withMessage("Company name is required"),
  
  // Job Description
  body("job_description")
    .trim()
    .notEmpty()
    .withMessage("Job description is required"),
  
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
  
  body("isVisaSponsored")
    .isBoolean()
    .withMessage("Visa sponsorship availability must be a boolean value"),
  
  body("username")
    .trim()
    .notEmpty()
    .withMessage("Username is required"),
    
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required"),
    
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Email must be valid"),
  
    body("jobID")
    .trim()
    .notEmpty()
    .withMessage("jobID is required")
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
  const { isFresherEligible, experience_required_in_months } = req.body;
  
  // Validate fresher eligibility logic
  if (isFresherEligible === true && parseInt(experience_required_in_months) > 0) {
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
  body("location").optional().isArray().withMessage("Location must be an array"),
  body("minCTC").optional().isString().withMessage("Minimum CTC must be a string"),
  body("maxCTC").optional().isString().withMessage("Maximum CTC must be a string"),
  body("type_of_employment").optional().isIn(["Full-time", "Part-time", "Contract-based", "Project-based", "Internship"]).withMessage("Invalid employment type"),
  body("work_environment").optional().isIn(["Remote", "Hybrid", "On-site"]).withMessage("Invalid work environment")
];