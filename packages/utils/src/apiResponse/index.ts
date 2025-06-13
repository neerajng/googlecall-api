import { Response } from "express";

export const ApiResponseCode = {
  Ok: 200,
  BadRequest: 400,
  Unauthorized: 401,
  Forbidden: 403,
  InternalServerError: 500,
  ServiceUnavailable: 503,
};

const success = (res: Response, data?: any, message: string = "Success") => {
  res.json({ status: "success", message, data });
};

const error = (res: Response, error?: any, message: string = "Error") => {
  const statusCode = error?.statusCode ? error.statusCode : ApiResponseCode.InternalServerError;

  const errorMessage = error?.message ?? "Something went wrong";

  res.status(statusCode).json({
    status: "error",
    message: errorMessage,
    errorDetails: error?.details,
  });
};

const formatZodHumanizeErrors = (error: any) => {
  if (!error?.errors?.length) return [];
  return error?.errors.map((err: any) => {
    return `${err?.path?.join(".")} - ${err?.message}`;
  });
};

const ApiResponse = { success, error, formatZodHumanizeErrors };

export default ApiResponse;
