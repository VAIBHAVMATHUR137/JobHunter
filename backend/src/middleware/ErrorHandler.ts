import { Request, Response, NextFunction } from "express";
import { constants } from "../constants";

interface CustomError extends Error {
  statusCode?: number;
}

const errorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err.statusCode || 500;

  let title = "Server Error";

  if (statusCode === constants.VALIDATION_ERROR) {
    title = "Validation Failed";
  } else if (statusCode === constants.UNAUTHORIZED) {
    title = "Unauthorized";
  } else if (statusCode === constants.FORBIDDEN) {
    title = "Forbidden";
  } else if (statusCode === constants.NOT_FOUND) {
    title = "Not Found";
  }

  const errorResponse = {
    title: title,
    message: err.message,
    stackTrace: process.env.NODE_ENV === "production" ? "🥞" : err.stack,
  };

  res.status(statusCode).json(errorResponse);
};

export default errorHandler;
