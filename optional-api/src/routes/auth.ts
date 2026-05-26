import bcrypt from "bcryptjs";
import { Router } from "express";
import { z } from "zod";
import type { User } from "@telugu-yuvatha/shared";
import { ApiError, ok } from "../lib/http.js";
import { getUserByEmail, saveEntity, timestamped } from "../lib/store.js";
import { requireAuth, signToken, type AuthRequest } from "../middleware/auth.js";

export const authRouter = Router();

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email().toLowerCase(),
  password: z.string().min(8),
  role: z.enum(["customer", "admin"]).default("customer")
});

authRouter.post("/register", async (req, res, next) => {
  try {
    const input = registerSchema.parse(req.body);
    if (await getUserByEmail(input.email)) throw new ApiError(409, "Email already registered");
    const user = timestamped<User>(
      ({
        name: input.name,
        email: input.email,
        role: input.role,
        passwordHash: await bcrypt.hash(input.password, 12),
        addresses: []
      } as unknown) as User,
      "usr"
    );
    await saveEntity("users", user);
    const { passwordHash, ...safeUser } = user;
    ok(res, { user: safeUser, token: signToken(user) }, 201);
  } catch (error) {
    next(error);
  }
});

authRouter.post("/login", async (req, res, next) => {
  try {
    const input = z.object({ email: z.string().email().toLowerCase(), password: z.string() }).parse(req.body);
    const user = await getUserByEmail(input.email);
    if (!user?.passwordHash || !(await bcrypt.compare(input.password, user.passwordHash))) {
      throw new ApiError(401, "Invalid email or password");
    }
    const { passwordHash, ...safeUser } = user;
    ok(res, { user: safeUser, token: signToken(user) });
  } catch (error) {
    next(error);
  }
});

authRouter.post("/password-reset", async (req, res, next) => {
  try {
    z.object({ email: z.string().email() }).parse(req.body);
    ok(res, { message: "If an account exists, a reset link will be sent." });
  } catch (error) {
    next(error);
  }
});

authRouter.get("/me", requireAuth, async (req: AuthRequest, res) => {
  const { passwordHash, ...safeUser } = req.user!;
  ok(res, { user: safeUser });
});
