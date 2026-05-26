import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import type { User, UserRole } from "@telugu-yuvatha/shared";
import { env } from "../env.js";
import { ApiError } from "../lib/http.js";
import { getEntity } from "../lib/store.js";

export interface AuthRequest extends Request {
  user?: User;
}

export function signToken(user: User) {
  return jwt.sign({ sub: user.id, role: user.role }, env.JWT_SECRET, { expiresIn: "7d" });
}

export async function requireAuth(req: AuthRequest, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) return next(new ApiError(401, "Authentication required"));
  try {
    const payload = jwt.verify(header.slice(7), env.JWT_SECRET) as { sub: string };
    const user = await getEntity("users", payload.sub);
    if (!user) throw new ApiError(401, "Invalid session");
    req.user = user;
    next();
  } catch (error) {
    next(error instanceof ApiError ? error : new ApiError(401, "Invalid session"));
  }
}

export async function optionalAuth(req: AuthRequest, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) return next();
  try {
    const payload = jwt.verify(header.slice(7), env.JWT_SECRET) as { sub: string };
    const user = await getEntity("users", payload.sub);
    if (user) req.user = user;
    next();
  } catch {
    next();
  }
}

export function requireRole(role: UserRole) {
  return (req: AuthRequest, _res: Response, next: NextFunction) => {
    if (req.user?.role !== role) return next(new ApiError(403, "Insufficient permissions"));
    next();
  };
}
