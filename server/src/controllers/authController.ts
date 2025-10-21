import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { Signup } from "../types";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
  
const generateToken = (userId: string, email: string) => {
  return jwt.sign({ userId, email }, process.env.JWT_SECRET!, {
    expiresIn: "7d",
  });
};

export const signup = async (req: Request, res: Response) => {
  try {
    const { name, email, password }: Signup = req.body;
    if (!name || !password || !email) {
      res.status(400).json({ error: "Fields are required" }); // Fix: should be object
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({ error: "Invalid email format" }); // Fix: should be object
      return;
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      res.status(409).json({ error: "Email already exists" }); // Fix: 409 status + object
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
        avatar: true,
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

    res.status(201).json({ 
      success: true, 
      message: "Account created successfully", 
      user 
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ error: "Email and password are required" });
      return;
    }

    // Fix: Don't use select here since we need the full user object
    const user = await prisma.user.findUnique({
      where: { email },
    });
    
    if (!user) {
      res.status(401).json({ error: "Invalid credentials" }); // Fix: 401 status + correct message
      return;
    }

    if (!user.password) {
      res.status(401).json({ error: "Please login with your social account" });
      return;
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      res.status(401).json({ error: "Invalid credentials" });
      return; // Fix: Add missing return
    }

    const token = generateToken(user.id, user.email);
    res.cookie("authToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/",
    });

    res.status(200).json({
      success: true,
      message: "Login Successful",
      user: { 
        id: user.id, 
        name: user.name, 
        email: user.email,
        avatar: user.avatar 
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Something went wrong" });
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
    res.status(500).json({ error: "Something went wrong" });
  }
};

export const googleCallback = async (req: Request, res: Response) => {
  try {
    const { googleId, email, name, picture } = req.user as any;
    
    let user: {
      id: string;
      name: string;
      email: string;
      avatar: string | null;
      createdAt: Date;
    };

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (!existingUser) {
      user = await prisma.user.create({
        data: {
          name,
          email,
          googleId,
          avatar: picture,
        },
        select: {
          id: true,
          name: true,
          email: true,
          avatar: true,
          createdAt: true,
        },
      });
    } else {
      user = await prisma.user.update({
        where: { email },
        data: {
          googleId: existingUser.googleId || googleId,
          avatar: existingUser.avatar || picture,
        },
        select: {
          id: true,
          name: true,
          email: true,
          avatar: true,
          createdAt: true,
        },
      });
    }

    const token = generateToken(user.id, user.email);

    res.cookie("authToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/",
    });

    res.redirect(`${process.env.CLIENT_URL}/dashboard`);
  } catch (error) {
    console.error("OAuth callback error:", error);
    res.redirect(`${process.env.CLIENT_URL}/auth/login?error=oauth_failed`);
  }
};

export const getCurrentUser = async (req: Request, res: Response) => {
  try {
    const token = req.cookies.authToken;

    if (!token) {
      res.status(401).json({ error: "Not authenticated" });
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        createdAt: true
      }
    });

    if (!user) {
      res.status(401).json({ error: "User not found" });
      return;
    }

    res.status(200).json({
      success: true,
      user
    });

  } catch (error) {
    console.error("Get current user error:", error);
    res.status(401).json({ error: "Invalid token" });
  }
};