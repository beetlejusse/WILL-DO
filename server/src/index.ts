import { configDotenv } from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import authRoutes  from '../src/routes/auth.routes';
import contentRoutes  from './routes/content.routes';
import brainRoutes  from './routes/brain.routes';
import cors from 'cors';

configDotenv();

const app = express();
app.use(express.json());
app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true
    })
);

app.use("/api/v1/auth", authRoutes)
app.use("/api/v1/content", contentRoutes)
app.use("/api/v1/brain", brainRoutes)

async function connectDB() {
    try {
        const mongoUri = process.env.MONGO_URI;
        if (!mongoUri) {
            throw new Error("MONGO_URI is not defined in the environment variables");
        }
        await mongoose.connect(mongoUri);
        app.listen(3000, () => {
            console.log("Server is running on port 3000");
        });
        console.log("Connected to the database");
    } catch (error: any) {
        console.error(error.message);
        process.exit(1);
    }
}
connectDB();