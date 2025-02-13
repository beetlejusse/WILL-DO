import { Router, Request, Response } from "express";
const authRoutes = Router();
import { userModel } from "../lib/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"

authRoutes.post("/signup", async (req: Request, res: Response): Promise<void> => {
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
        const existingUser = await userModel.findOne({ userName });
        if (existingUser) {
            res.status(403).json({ message: "User already exists" });
            return;
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);

        // Create new user
        const newUser = new userModel({
            userName,
            password: hashPassword,
        });

        await newUser.save();

        res.status(201).json({ message: "User created successfully", user: newUser });

    } catch (error: any) {
        console.error("Signup error:", error);
        res.status(500).json({ message: "Failed to create user", error: error.message });
    }
});

authRoutes.post("/signin", async (req: Request, res: Response): Promise<void> => {
    try {
        const { userName, password } = req.body;

        if (!userName || !password) {
            res.status(400).json({ message: "Email and password are required" });
            return;
        }
        const user = await userModel.findOne({ userName });
        if (!user) {
            res.status(400).json({ message: "Invalid email or password" });
            return;
        }
        const isMatch = await bcrypt.compare(password, user.password);
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
        const token = jwt.sign({ _id: user._id }, jwtSecret, { expiresIn: "1h" });

        res.header("auth-token", token).json({ token });
        console.log("Signin successful");
    } catch (error: any) {
        console.error("Signin Error:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
});

export default authRoutes;