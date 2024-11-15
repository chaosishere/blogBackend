"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = __importDefault(require("../db"));
const middlewares_1 = __importDefault(require("../middlewares")); // Fix typo: middlewares instead of middlwares
const blog_common_1 = require("@chaosdevelopertools/blog-common");
const blogRouter = (0, express_1.Router)();
// POST route to create a blog, protected by authMiddleware
blogRouter.post("/blog", middlewares_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = blog_common_1.blogBody.safeParse(req.body);
    if (result.success) {
        try {
            const { title, content, published = false } = result.data;
            const userId = req.user;
            // Access the authenticated user's ID from req.user (set in authMiddleware)
            const blog = yield db_1.default.post.create({
                data: {
                    title,
                    content,
                    published,
                    authorId: userId, // Using the userId from the token
                },
            });
            res.status(201).json(blog); // Return the created blog
        }
        catch (error) {
            res.status(500).json({ error: "Failed to create blog post" });
        }
    }
    else {
        res.status(400).json({ error: "Invalid blog data" });
    }
}));
// GET route to retrieve a blog post by ID
blogRouter.get("/blog/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const blog = yield db_1.default.post.findUnique({
            where: {
                id,
            },
        });
        if (blog) {
            res.json(blog);
        }
        else {
            res.status(404).json({ message: "No blog found" });
        }
    }
    catch (error) {
        res.status(500).json({ error: "Error retrieving the blog post" });
    }
}));
exports.default = blogRouter;
