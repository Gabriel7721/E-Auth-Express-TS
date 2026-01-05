import type { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/http.js";

export function errorMiddleware(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  if (err instanceof ApiError) {
    return res.status(err.status).json({ error: err.payload });
  }

  return res.status(500).json({ error: { message: "Internal Server Error" } });
}
