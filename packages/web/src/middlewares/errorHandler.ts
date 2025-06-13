import { Request, Response, NextFunction } from "express";

// Centralized Error-Handling Middleware
function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
  const statusCode = 500;
  // Return a JSON response for errors
  res.status(statusCode).json({
    statusCode,
    error: "Internal Server Error",
    message: err.message,
  });
}

export default errorHandler;
