import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { Signup } from "../types";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


const prisma = new PrismaClient();

const generateToken = (userId: number, email: string) => {
  return jwt.sign({ userId, email }, process.env.JWT_SECRET!, {
    expiresIn: "7d",
  });
};

export const signup = async (req: Request, res: Response) => {
  try {
    const { name, email, password }: Signup = req.body;
    if (!name || !password || !email) {
      res.status(400).json("Fields are required");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      res.status(400).json("Invalid email format");
      return;
    }

    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (existingUser) {
      res.status(400).json("Email already exist");
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });

    const token = generateToken(user.id, user.email);
    res.cookie("authToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/",
    });

    res
      .status(201)
      .json({ success: true, message: "Account created successfully", user });
  } catch (error) {
    console.error("Signup error:", error);
    res
      .status(500)
      .json({ error: "Invalid server error, Something went wrong" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({
        error: "Email and password are required",
      });
      return;
    }

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (!user) {
      res.status(400).json({ error: "User already exist" });
      return;
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      res.status(400).json({ error: "Invalid credentials" });
    }

    const token = generateToken(user.id, user.email);
    res.cookie("authToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/",
    });
    res
      .status(200)
      .json({
        success: true,
        message: "Login Successful",
        user: { id: user.id, name: user.name, email: user.email },
      });
  } catch (error) {
    console.error("Login error:", error);
    res
      .status(500)
      .json({ error: "Invalid server error, Something went wrong" });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    res.clearCookie("authToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    });
    res.status(200).json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    res
      .status(500)
      .json({ error: "Invalid server error, Something went wrong" });
  }
};
