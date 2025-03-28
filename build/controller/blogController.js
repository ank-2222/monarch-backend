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
exports.BlogController = void 0;
const blogService_1 = require("../service/blogService");
const errors_handler_1 = __importDefault(require("../utils/errors.handler"));
const res_error_1 = require("../utils/res.error");
const blogService = new blogService_1.BlogService();
class BlogController {
    constructor() {
        this.execute = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const method = req.method;
                const path = req.route.path;
                const id = req.params.id;
                if (path === "/") {
                    if (method === "POST") {
                        const result = yield this.createBlog(req, res);
                        res.status(201).json(result);
                    }
                    else if (method === "GET") {
                        const result = yield this.getBlogs(req, res);
                        res.status(200).json(result);
                    }
                }
                else if (path === "/:id" && id) {
                    if (method === "GET") {
                        const result = yield this.getBlogById(req, res);
                        res.status(200).json(result);
                    }
                    else if (method === "PUT") {
                        const result = yield this.updateBlog(req, res);
                        res.status(200).json(result);
                    }
                    else if (method === "DELETE") {
                        const result = yield this.deleteBlog(req, res);
                        res.status(200).json(result);
                    }
                }
                else if (path === "/status/:id" && id) {
                    if (method === "PATCH") {
                        const result = yield this.togglePublish(req, res);
                        res.status(200).json(result);
                    }
                }
                else if (path === "/published") {
                    if (method === "GET") {
                        const result = yield this.getPublishedBlogs(req, res);
                        res.status(200).json(result);
                    }
                }
            }
            catch (error) {
                (0, res_error_1.errorHandler)(error, req, res);
            }
        });
    }
    getPublishedBlogs(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const blogs = yield blogService.getPublishedBlogs();
                return ({
                    message: "Blogs retrieved successfully",
                    message_code: "BLOGS_RETRIEVED",
                    data: blogs,
                });
            }
            catch (error) {
                throw new errors_handler_1.default({
                    message: error.message,
                    message_code: "ERROR_FETCHING_BLOG",
                    status: 500,
                });
            }
        });
    }
    createBlog(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { user } = req;
                const blog = yield blogService.createBlog(Object.assign(Object.assign({}, req.body), { author: user.id }));
                return ({
                    message: "Blog created successfully",
                    message_code: "BLOG_CREATED",
                    data: blog,
                });
            }
            catch (error) {
                throw new errors_handler_1.default({
                    message: error.message,
                    message_code: "ERROR_CREATING_BLOG",
                });
            }
        });
    }
    getBlogs(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const blogs = yield blogService.getBlogs();
                return ({
                    message: "Blogs retrieved successfully",
                    message_code: "BLOGS_RETRIEVED",
                    data: blogs,
                });
            }
            catch (error) {
                throw new errors_handler_1.default({
                    message: error.message,
                    message_code: "ERROR_FETCHING_BLOG",
                });
            }
        });
    }
    getBlogById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const blog = yield blogService.getBlogById(req.params.id);
                if (!blog) {
                    throw new errors_handler_1.default({
                        message: "Blog not found",
                        message_code: "BLOG_NOT_FOUND",
                    });
                }
                return ({
                    message: "Blog retrieved successfully",
                    message_code: "BLOG_RETRIEVED",
                    data: blog,
                });
            }
            catch (error) {
                throw new errors_handler_1.default({
                    message: error.message,
                    message_code: "ERROR_FETCHING_BLOG",
                });
            }
        });
    }
    updateBlog(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const blog = yield blogService.updateBlog(req.params.id, req.body);
                if (!blog) {
                    throw new errors_handler_1.default({
                        message: "Blog not found",
                        message_code: "BLOG_NOT_FOUND",
                    });
                }
                return ({
                    message: "Blog updated successfully",
                    message_code: "BLOG_UPDATED",
                    data: blog,
                });
            }
            catch (error) {
                throw new errors_handler_1.default({
                    message: error.message,
                    message_code: "ERROR_UPDATING_BLOG",
                });
            }
        });
    }
    deleteBlog(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const message = yield blogService.deleteBlog(req.params.id);
                return ({
                    message: message,
                    message_code: "BLOG_DELETED",
                    data: null,
                });
            }
            catch (error) {
                throw new errors_handler_1.default({
                    message: error.message,
                    message_code: "ERROR_DELETING_BLOG",
                });
            }
        });
    }
    togglePublish(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const blog = yield blogService.togglePublish(req.params.id, req.body.status);
                if (!blog) {
                    throw new errors_handler_1.default({
                        message: "Blog not found",
                        message_code: "BLOG_NOT_FOUND",
                    });
                }
                return ({
                    message: "Blog updated successfully",
                    message_code: "BLOG_STATUS_UPDATED",
                    data: blog,
                });
            }
            catch (error) {
                throw new errors_handler_1.default({
                    message: error.message,
                    message_code: "ERROR_TOGGLING_BLOG",
                });
            }
        });
    }
}
exports.BlogController = BlogController;
