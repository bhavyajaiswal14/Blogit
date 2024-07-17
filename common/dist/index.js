"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateBlogSchema = exports.createBlogSchema = exports.signinSchema = exports.signupSchema = void 0;
const Zod_1 = __importDefault(require("Zod"));
exports.signupSchema = Zod_1.default.object({
    email: Zod_1.default.string().email(),
    password: Zod_1.default.string(),
    name: Zod_1.default.string(),
});
exports.signinSchema = Zod_1.default.object({
    email: Zod_1.default.string().email(),
    password: Zod_1.default.string(),
});
exports.createBlogSchema = Zod_1.default.object({
    title: Zod_1.default.string(),
    content: Zod_1.default.string(),
});
exports.updateBlogSchema = Zod_1.default.object({
    title: Zod_1.default.string(),
    content: Zod_1.default.string(),
    id: Zod_1.default.number(),
});
