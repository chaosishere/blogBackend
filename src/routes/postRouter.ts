import { Router } from "express";
import { z } from "zod";
import prisma from "../db";
import authMiddleware from "../middlewares"; // Fix typo: middlewares instead of middlwares

const blogRouter = Router();

const blogBody = z.object({
  title: z.string().min(4),
  content: z.string(),
  published: z.boolean().optional(), // published is optional, default to false
});

// POST route to create a blog, protected by authMiddleware
blogRouter.post("/blog", authMiddleware, async (req, res) => {
  const result = blogBody.safeParse(req.body);

  if (result.success) {
    try {
      const { title, content, published = false } = result.data;
      const userId = req.user as string;
      // Access the authenticated user's ID from req.user (set in authMiddleware)
      const blog = await prisma.post.create({
        data: {
          title,
          content,
          published,
          authorId: userId, // Using the userId from the token
        },
      });

      res.status(201).json(blog); // Return the created blog
    } catch (error) {
      res.status(500).json({ error: "Failed to create blog post" });
    }
  } else {
    res.status(400).json({ error: "Invalid blog data" });
  }
});

// GET route to retrieve a blog post by ID
blogRouter.get("/blog/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const blog = await prisma.post.findUnique({
      where: {
        id,
      },
    });

    if (blog) {
      res.json(blog);
    } else {
      res.status(404).json({ message: "No blog found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error retrieving the blog post" });
  }
});

export default blogRouter;
