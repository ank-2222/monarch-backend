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
exports.protectAdmin = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Admin_1 = require("../models/Admin");
const errors_handler_1 = __importDefault(require("../utils/errors.handler"));
const protectAdmin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const token = ((_a = req === null || req === void 0 ? void 0 : req.cookies) === null || _a === void 0 ? void 0 : _a.authToken) || ((_b = req.headers.authorization) === null || _b === void 0 ? void 0 : _b.split(" ")[1]);
        if (!token) {
            throw new errors_handler_1.default({
                message: "No token has been provided",
                message_code: "NO_TOKEN",
            });
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        const user = yield Admin_1.Admin.findById(decoded.id).select("-password");
        if (!user) {
            throw new errors_handler_1.default({
                message: "User not found",
                message_code: "USER_NOT_FOUND",
            });
        }
        req.user = user;
        next(); // Call next() directly without resolve()
    }
    catch (error) {
        next(error instanceof errors_handler_1.default
            ? error
            : new errors_handler_1.default({
                message: "Not authorized, token failed",
                message_code: "TOKEN_FAILED",
            }));
    }
});
exports.protectAdmin = protectAdmin;
