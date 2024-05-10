import { Response } from "express";
import httpStatus from "http-status";

export const APIResponse = (
  res: Response,
  status: number,
  message?: string,
  data?: any
) => {
  return res.status(status).json({
    code: status,
    message: status === 500 ? "Internal Server Error" : message ? message : "",
    data: data ? data : [],
  });
};

export const APIResponse500 = (res: Response) => {
  return APIResponse(
    res,
    httpStatus.INTERNAL_SERVER_ERROR,
    "Internal Server Error,"
  );
};

export const APIResponse404 = (res: Response, message?: string) => {
  return APIResponse(
    res,
    httpStatus.NOT_FOUND,
    message ? message : "Not Found."
  );
};
