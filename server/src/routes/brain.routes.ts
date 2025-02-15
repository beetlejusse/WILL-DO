import { Router, Request, Response } from "express";
const brainRoutes = Router();
import { contentModel, linkModel, userModel } from "../lib/db";
import { userMiddleware } from "../middleware";
import crypto from "crypto";

//for sharing content link
brainRoutes.post("/share", userMiddleware, async (req: Request, res: Response): Promise<void> => {
    try {
        const { share } = req.body;
        const userId = (req as any).userId; // Ensure `userId` is available from middleware

        if (!userId) {
            res.status(400).json({ error: "User ID missing" });
            return;
        }

        if (share) {
            // Check if a link already exists for the user
            const existingLink = await linkModel.findOne({ userId });
            if (existingLink) {
                res.json({ hash: existingLink.hash }); // Send existing hash if found
                return;
            }

            // Generate a new hash for the shareable link
            const hash = generateHash(10);
            await linkModel.create({ userId, hash });

            res.json({ hash }); // Send new hash in response
        } else {
            // Remove the shareable link if `share` is false
            await linkModel.deleteOne({ userId });
            res.json({ message: "Removed link" });
        }
    } catch (error) {
        console.error("Error in /share:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

brainRoutes.post("/:shareLink", userMiddleware, async (req, res): Promise<void> => {
    const hash = req.params.shareLink;

    // Find the link using the provided hash.
    const link = await linkModel.findOne({ hash });
    if (!link) {
        res.status(404).json({ message: "Invalid share link" }); // Send error if not found.
        return;
    }

    // Fetch content and user details for the shareable link.
    const content = await contentModel.find({ userId: link.userId });
    const user = await userModel.findOne({ _id: link.userId });

    if (!user) {
        res.status(404).json({ message: "User not found" }); // Handle missing user case.
        return;
    }

    res.json({
        username: user.userName,
        content
    });
});

export default brainRoutes;
function generateHash(length: number): string {
    return crypto.randomBytes(length).toString("hex").slice(0, length);
}
