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
const brainRoutes = (0, express_1.Router)();
const db_1 = require("../lib/db");
const middleware_1 = require("../middleware");
const crypto_1 = __importDefault(require("crypto"));
//for sharing content link
brainRoutes.post("/share", middleware_1.userMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { share } = req.body;
        const userId = req.userId; // Ensure `userId` is available from middleware
        if (!userId) {
            res.status(400).json({ error: "User ID missing" });
            return;
        }
        if (share) {
            // Check if a link already exists for the user
            const existingLink = yield db_1.linkModel.findOne({ userId });
            if (existingLink) {
                res.json({ hash: existingLink.hash }); // Send existing hash if found
                return;
            }
            // Generate a new hash for the shareable link
            const hash = generateHash(10);
            yield db_1.linkModel.create({ userId, hash });
            res.json({ hash }); // Send new hash in response
        }
        else {
            // Remove the shareable link if `share` is false
            yield db_1.linkModel.deleteOne({ userId });
            res.json({ message: "Removed link" });
        }
    }
    catch (error) {
        console.error("Error in /share:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}));
brainRoutes.post("/:shareLink", middleware_1.userMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const hash = req.params.shareLink;
    // Find the link using the provided hash.
    const link = yield db_1.linkModel.findOne({ hash });
    if (!link) {
        res.status(404).json({ message: "Invalid share link" }); // Send error if not found.
        return;
    }
    // Fetch content and user details for the shareable link.
    const content = yield db_1.contentModel.find({ userId: link.userId });
    const user = yield db_1.userModel.findOne({ _id: link.userId });
    if (!user) {
        res.status(404).json({ message: "User not found" }); // Handle missing user case.
        return;
    }
    res.json({
        username: user.userName,
        content
    });
}));
exports.default = brainRoutes;
function generateHash(length) {
    return crypto_1.default.randomBytes(length).toString("hex").slice(0, length);
}
