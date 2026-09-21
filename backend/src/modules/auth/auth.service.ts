import bcrypt from "bcryptjs";
import { User } from "./auth.model.js";
import { ApiError } from "../../shared/utils/ApiError.js";
import { signSession } from "./auth.jwt.js";
import { LoginInput, RegisterInput } from "./auth.validator.js";

const SALT_ROUNDS = 12;

export interface AuthResult {
  token: string;
  user: { id: string; email: string };
}

export async function registerUser({
  email,
  password,
}: RegisterInput): Promise<AuthResult> {
  const existing = await User.findOne({ email });
  if (existing) {
    throw ApiError.conflict(
      "An account with this email already exists",
      "EMAIL_TAKEN",
    );
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  const user = await User.create({ email, passwordHash });

  return {
    token: signSession({ sub: user._id.toString(), email: user.email }),
    user: { id: user._id.toString(), email: user.email },
  };
}

export async function authenticateUser({
  email,
  password,
}: LoginInput): Promise<AuthResult> {
  const user = await User.findOne({ email });
  const valid = user
    ? await bcrypt.compare(password, user.passwordHash)
    : false;

  if (!user || !valid) {
    throw ApiError.unauthorized(
      "Invalid email or password",
      "INVALID_CREDENTIALS",
    );
  }

  return {
    token: signSession({ sub: user._id.toString(), email: user.email }),
    user: { id: user._id.toString(), email: user.email },
  };
}

export async function getUserById(
  userId: string,
): Promise<{ id: string; email: string }> {
  const user = await User.findById(userId).select("email");
  if (!user) {
    throw ApiError.unauthorized(
      "Session expired or invalid, please sign in again",
      "SESSION_EXPIRED",
    );
  }
  return { id: user._id.toString(), email: user.email };
}
