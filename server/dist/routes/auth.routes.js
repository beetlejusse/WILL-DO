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
const authRoutes = (0, express_1.Router)();
const db_1 = require("../lib/db");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
authRoutes.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userName, password } = req.body;
        // Input validation
        if (!userName || !password) {
            res.status(400).json({ message: "Username and password are required" });
            return;
        }
        if (userName.length < 3 || userName.length > 10) {
            res.status(411).json({ message: "Username must be between 3 and 10 characters" });
            return;
        }
        if (password.length < 6 || password.length > 20) {
            res.status(411).json({ message: "Password must be between 6 and 20 characters" });
            return;
        }
        // Check if user already exists
        const existingUser = yield db_1.userModel.findOne({ userName });
        if (existingUser) {
            res.status(403).json({ message: "User already exists" });
            return;
        }
        // Hash password
        const salt = yield bcryptjs_1.default.genSalt(10);
        const hashPassword = yield bcryptjs_1.default.hash(password, salt);
        // Create new user
        const newUser = new db_1.userModel({
            userName,
            password: hashPassword,
        });
        yield newUser.save();
        res.status(201).json({ message: "User created successfully", user: newUser });
    }
    catch (error) {
        console.error("Signup error:", error);
        res.status(500).json({ message: "Failed to create user", error: error.message });
    }
}));
authRoutes.post("/signin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userName, password } = req.body;
        if (!userName || !password) {
            res.status(400).json({ message: "Email and password are required" });
            return;
        }
        const user = yield db_1.userModel.findOne({ userName });
        if (!user) {
            res.status(400).json({ message: "Invalid email or password" });
            return;
        }
        const isMatch = yield bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            res.status(400).json({ message: "Invalid email or password" });
            return;
        }
        const jwtSecret = process.env.JWT_SIGNIN_SECRET;
        if (!jwtSecret) {
            console.error("JWT secret is missing in environment variables.");
            res.status(500).json({ message: "Internal server error" });
            return;
        }
        const token = jsonwebtoken_1.default.sign({ _id: user._id }, jwtSecret, { expiresIn: "1h" });
        res.header("auth-token", token).json({ token });
        console.log("Signin successful");
    }
    catch (error) {
        console.error("Signin Error:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
}));
exports.default = authRoutes;
