import type { Response } from "express";

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message);
  }
}

export function ok<T>(res: Response, data: T, status = 200) {
  return res.status(status).json({ data });
}
