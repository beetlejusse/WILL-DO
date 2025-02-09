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
const dotenv_1 = require("dotenv");
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const auth_routes_1 = __importDefault(require("../dist/routes/auth.routes"));
const content_routes_1 = __importDefault(require("./routes/content.routes"));
const brain_routes_1 = __importDefault(require("./routes/brain.routes"));
(0, dotenv_1.configDotenv)();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use("/api/v1/auth", auth_routes_1.default);
app.use("/api/v1/content", content_routes_1.default);
app.use("/api/v1/brain", brain_routes_1.default);
function connectDB() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const mongoUri = process.env.MONGO_URI;
            if (!mongoUri) {
                throw new Error("MONGO_URI is not defined in the environment variables");
            }
            yield mongoose_1.default.connect(mongoUri);
            app.listen(3000, () => {
                console.log("Server is running on port 3000");
            });
            console.log("Connected to the database");
        }
        catch (error) {
            console.error(error.message);
            process.exit(1);
        }
    });
}
connectDB();
