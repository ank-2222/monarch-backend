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
exports.AdminController = void 0;
const Admin_1 = require("../models/Admin");
const generateToken_1 = require("../utils/generateToken");
const errors_handler_1 = __importDefault(require("../utils/errors.handler"));
const res_error_1 = require("../utils/res.error");
class AdminController {
    constructor() {
        this.execute = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const method = req.method;
                const path = req.route.path;
                const id = req.params.id;
                if (path === "/register" && method === "POST") {
                    const result = yield this.register(req, res);
                    res.status(201).json(result);
                }
                else if (path === "/login" && method === "POST") {
                    const result = yield this.login(req, res);
                    res.status(200).json(result);
                }
                else if (path === "/profile" && method === "GET") {
                    const result = yield this.getProfile(req, res);
                    res.status(200).json(result);
                }
                else if (path === "/profile" && method === "PUT") {
                    const result = yield this.updateProfile(req, res);
                    res.status(200).json(result);
                }
                else if (path === "/logout" && method === "POST") {
                    const result = yield this.logout(req, res);
                    res.status(200).json(result);
                }
            }
            catch (error) {
                (0, res_error_1.errorHandler)(error, req, res);
            }
        });
    }
    register(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, email, password } = req.body;
                const existingAdmin = yield Admin_1.Admin.findOne({ email });
                if (existingAdmin) {
                    throw new errors_handler_1.default({
                        message: "Admin already exists",
                        message_code: "ADMIN_ALREADY_EXIST",
                    });
                }
                const admin = yield Admin_1.Admin.create({ name, email, password });
                return {
                    message: "Admin registered successfully",
                    message_code: "ADMIN_REGISTERED",
                    data: {
                        name: admin.name,
                        email: admin.email,
                        token: (0, generateToken_1.generateToken)(admin._id),
                    },
                };
            }
            catch (error) {
                throw new errors_handler_1.default({
                    message: error.message,
                    message_code: "ERROR_REGISTERING_ADMIN",
                });
            }
        });
    }
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                const admin = yield Admin_1.Admin.findOne({ email });
                if (!admin || !(yield admin.matchPassword(password))) {
                    throw new errors_handler_1.default({
                        message: "Invalid email or password",
                        message_code: "INVALID_CREDENTIALS",
                    });
                }
                return {
                    message: "Admin logged in successfully",
                    message_code: "ADMIN_LOGGED_IN",
                    data: {
                        name: admin.name,
                        email: admin.email,
                        token: (0, generateToken_1.generateToken)(admin._id),
                    },
                };
            }
            catch (error) {
                throw new errors_handler_1.default({
                    message: error.message,
                    message_code: "ERROR_LOGGING_IN_ADMIN",
                });
            }
        });
    }
    getProfile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { user } = req;
                const admin = yield Admin_1.Admin.findById(user.id).select("-password");
                if (!admin) {
                    throw new errors_handler_1.default({
                        message: "Admin not found",
                        message_code: "ADMIN_NOT_FOUND",
                    });
                }
                return {
                    message: "Admin profile retrieved successfully",
                    message_code: "ADMIN_PROFILE_RETRIEVED",
                    data: admin,
                };
            }
            catch (error) {
                throw new errors_handler_1.default({
                    message: error.message,
                    message_code: "ERROR_FETCHING_ADMIN_PROFILE",
                });
            }
        });
    }
    updateProfile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { user } = req;
                const admin = yield Admin_1.Admin.findById(user.id);
                if (!admin) {
                    throw new errors_handler_1.default({
                        message: "Admin not found",
                        message_code: "ADMIN_NOT_FOUND",
                    });
                }
                admin.name = req.body.name || admin.name;
                admin.email = req.body.email || admin.email;
                if (req.body.password) {
                    admin.password = req.body.password;
                }
                yield admin.save();
                return {
                    message: "Profile updated successfully",
                    message_code: "PROFILE_UPDATED",
                    data: {
                        name: admin.name,
                        email: admin.email,
                    },
                };
            }
            catch (error) {
                throw new errors_handler_1.default({
                    message: error.message,
                    message_code: "ERROR_UPDATING_ADMIN_PROFILE",
                });
            }
        });
    }
    logout(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            return {
                message: "Admin logged out successfully",
                message_code: "ADMIN_LOGGED_OUT",
                data: null,
            };
        });
    }
}
exports.AdminController = AdminController;
