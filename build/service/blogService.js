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
exports.BlogService = void 0;
const Blog_1 = require("../models/Blog");
const errors_handler_1 = __importDefault(require("../utils/errors.handler"));
class BlogService {
    createBlog(data) {
        return __awaiter(this, void 0, void 0, function* () {
            // Check if a blog with the same title exists
            const existingBlog = yield Blog_1.Blog.findOne({ title: data.title });
            if (existingBlog) {
                throw new Error("A blog with this title already exists.");
            }
            const blog = new Blog_1.Blog(data);
            return yield blog.save();
        });
    }
    getBlogs() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Blog_1.Blog.find().populate("author", "name email");
        });
    }
    getBlogById(blogId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Blog_1.Blog.findById(blogId).populate("author", "name email");
        });
    }
    updateBlog(blogId, updates) {
        return __awaiter(this, void 0, void 0, function* () {
            const existingBlog = yield Blog_1.Blog.findById(blogId);
            if (!existingBlog) {
                throw new Error("Blog not found");
            }
            const mergedUpdates = Object.assign(Object.assign(Object.assign({}, existingBlog.toObject()), updates), { seo: Object.assign(Object.assign({}, existingBlog.seo), updates.seo) });
            return yield Blog_1.Blog.findByIdAndUpdate(blogId, { $set: mergedUpdates }, { new: true, runValidators: true });
        });
    }
    deleteBlog(blogId) {
        return __awaiter(this, void 0, void 0, function* () {
            const blog = yield Blog_1.Blog.findById(blogId);
            if (!blog) {
                throw new errors_handler_1.default({ message: "Blog not found", message_code: "BLOG_NOT_FOUND" });
            }
            yield blog.deleteOne();
            return "Blog deleted successfully";
        });
    }
    togglePublish(blogId, status) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Blog_1.Blog.findByIdAndUpdate(blogId, { status }, { new: true });
        });
    }
}
exports.BlogService = BlogService;
