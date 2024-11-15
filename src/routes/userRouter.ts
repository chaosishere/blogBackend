import { Router } from "express";
import { z } from "zod";
import prisma from "../db";
import { JWT_SECRET } from "../config";
import jwt from "jsonwebtoken";
import { signUpBody } from "@chaosdevelopertools/blog-common";

const userRouter = Router();

userRouter.post("/signup", async (req, res) => {
  const result = signUpBody.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({
      message: result.error.errors.map((e) => e.message),
    });
    return;
  }

  const { email, password } = result.data;

  try {
    const user = await prisma.user.create({
      data: {
        email,
        password,
      },
    });
    res.status(201).json({
      message: "User created successfully",
      user: { id: user.id, email: user.email }, // Return user details safely
    });
  } catch (e) {
    res.status(500).json({
      message: "Error creating user",
      error: e,
    });
  }
});

userRouter.post("/signin", async (req, res) => {
  const result = signUpBody.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({
      message: result.error.errors.map((e) => e.message),
    });
    return;
  }

  const { email, password } = result.data;

  const user = await prisma.user.findFirst({
    where: {
      email,
      password,
    },
  });
  if (user) {
    const token = jwt.sign(
      {
        userId: user.id,
      },
      JWT_SECRET,
    );

    res.json({
      token,
    });
  } else {
    res.json({ message: "Invalid Inputs" });
  }
  return;
});

export default userRouter;
