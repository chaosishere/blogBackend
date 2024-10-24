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
const zod_1 = require("zod");
const db_1 = __importDefault(require("../db"));
const config_1 = require("../config");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userRouter = (0, express_1.Router)();
const signUpBody = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(8),
});
userRouter.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = signUpBody.safeParse(req.body);
    if (!result.success) {
        res.status(400).json({
            message: result.error.errors.map((e) => e.message),
        });
        return;
    }
    const { email, password } = result.data;
    try {
        const user = yield db_1.default.user.create({
            data: {
                email,
                password,
            },
        });
        res.status(201).json({
            message: "User created successfully",
            user: { id: user.id, email: user.email }, // Return user details safely
        });
    }
    catch (e) {
        res.status(500).json({
            message: "Error creating user",
            error: e,
        });
    }
}));
userRouter.post("/signin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = signUpBody.safeParse(req.body);
    if (!result.success) {
        res.status(400).json({
            message: result.error.errors.map((e) => e.message),
        });
        return;
    }
    const { email, password } = result.data;
    const user = yield db_1.default.user.findFirst({
        where: {
            email,
            password,
        },
    });
    if (user) {
        const token = jsonwebtoken_1.default.sign({
            userId: user.id,
        }, config_1.JWT_SECRET);
        res.json({
            token: token,
        });
    }
    else {
        res.json({ message: "Invalid Inputs" });
    }
    return;
}));
exports.default = userRouter;
