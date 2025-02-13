import { Router, Request, Response } from "express";
const contentRoutes = Router();
import { contentModel } from "../lib/db";
import { userMiddleware } from "../middleware";

contentRoutes.post("/", userMiddleware, async (req: Request, res: Response): Promise<void> => {
    const {link, title} = req.body;
    try {
        const addContent = new contentModel({
            link,
            title,
            userId: req.body.userId,
            tags: []
        })

        await addContent.save();
        
        console.log("Content created successfully");
        res.status(201).json({ message: "Content created successfully" });
    } catch (error: any) {
        console.error("Error creating content:", error);
        res.status(500).json({ message: "Failed to create content", error: error.message });
        
    }
})

contentRoutes.get("/", userMiddleware, async (req: Request, res: Response): Promise<void> => {
    try {
        const contents = await contentModel.find({ userId: (req as any).userId }).populate("userId", "userName");
        res.status(200).json(contents);
        console.log("Content fetched successfully");
    } catch (error: any) {
        console.error("Error fetching content:", error);
        res.status(500).json({ message: "Failed to fetch content", error: error.message });
    }
})

contentRoutes.delete("/", userMiddleware, async (req, res): Promise<void> => {
    const contentId = req.body.contentId;
    if (!contentId) {
        res.status(400).json({ message: "Content ID is required" });
    }
    await contentModel.deleteMany({ contentId, userId: (req as any).userId });
    res.json({ message: "Deleted" }); // Send success response.
});

export default contentRoutes;