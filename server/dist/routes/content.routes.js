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
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const contentRoutes = (0, express_1.Router)();
const db_1 = require("../lib/db");
const middleware_1 = require("../middleware");
contentRoutes.post("/", middleware_1.userMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { link, title } = req.body;
    try {
        const addContent = new db_1.contentModel({
            link,
            title,
            userId: req.body.userId,
            tags: []
        });
        yield addContent.save();
        console.log("Content created successfully");
        res.status(201).json({ message: "Content created successfully" });
    }
    catch (error) {
        console.error("Error creating content:", error);
        res.status(500).json({ message: "Failed to create content", error: error.message });
    }
}));
contentRoutes.get("/", middleware_1.userMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const contents = yield db_1.contentModel.find({ userId: req.userId }).populate("userId", "userName");
        res.status(200).json(contents);
        console.log("Content fetched successfully");
    }
    catch (error) {
        console.error("Error fetching content:", error);
        res.status(500).json({ message: "Failed to fetch content", error: error.message });
    }
}));
contentRoutes.delete("/", middleware_1.userMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const contentId = req.body.contentId;
    if (!contentId) {
        res.status(400).json({ message: "Content ID is required" });
    }
    yield db_1.contentModel.deleteMany({ contentId, userId: req.userId });
    res.json({ message: "Deleted" }); // Send success response.
}));
exports.default = contentRoutes;
