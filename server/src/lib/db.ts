import mongoose, { Schema, Document, Model } from "mongoose";

interface User extends Document {
    userName: string;
    password: string;
}

const userSchema = new Schema<User>({
    userName: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
});

interface Content extends Document {
    title: string;
    link: string;
    tags: mongoose.Types.ObjectId[];
    userId: mongoose.Types.ObjectId[];
}

const contentSchema = new Schema<Content>({
    title: { type: String },
    link: { type: String },
    tags: [{ type: mongoose.Types.ObjectId, ref: "Tag" }],
    userId: [{
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true,
    }],
});

interface Link extends Document {
    hash: string;
    userId: mongoose.Types.ObjectId[];
}

const linkSchema = new Schema<Link>({
    // 'hash' is a string that represents the shortened or hashed version of a link
    hash: String,
    userId: [{ type: mongoose.Types.ObjectId, ref: 'User', required: true, unique: true }],
});

export const userModel = (mongoose.models.User as mongoose.Model<User>) || (mongoose.model<User>("User", userSchema))
export const contentModel = (mongoose.models.Content as mongoose.Model<Content>) || (mongoose.model<Content>("Content", contentSchema))
export const linkModel = (mongoose.models.Link as mongoose.Model<Link>) || (mongoose.model<Link>("Link", linkSchema))