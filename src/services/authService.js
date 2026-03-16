import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { createAppError } from "../utils/createAppError.js";

import dotenv from "dotenv";

dotenv.config();

const register = async ({ name, email, password }) => {
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw createAppError("User already exists", 400);
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hashedPassword });
  return user;
};

const login = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw createAppError("User not found", 404);
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw createAppError("Invalid credentials", 401);
  }

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
  return { 
    token, 
    userId: user._id,
    user: {
      name: user.name,
      email: user.email
    }
  };
};

export { register, login };