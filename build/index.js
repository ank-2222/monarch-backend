"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
require("dotenv/config");
const body_parser_1 = __importDefault(require("body-parser"));
const errors_handler_1 = __importDefault(require("./utils/errors.handler"));
const app = (0, express_1.default)();
const port = process.env.PORT || 5000;
const moment_1 = __importDefault(require("moment"));
const db_config_1 = require("./config/db.config");
app.use((0, cors_1.default)({
    origin: ["http://localhost:5173", "https://property-frontend-yrc7.onrender.com", "http://localhost:5174"],
    credentials: true,
}));
(0, db_config_1.connectDB)();
//Middlewares
app.use(express_1.default.json());
app.use(body_parser_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(body_parser_1.default.urlencoded({ extended: true }));
//---------------------------------------------------------------
//Routes
const propertyRoute_1 = __importDefault(require("./routes/propertyRoute"));
const adminRoute_1 = __importDefault(require("./routes/adminRoute"));
const blogRoute_1 = __importDefault(require("./routes/blogRoute"));
const s3Route_1 = __importDefault(require("./routes/s3Route"));
app.use("/v1/property", propertyRoute_1.default);
app.use("/v1/admin", adminRoute_1.default);
app.use("/v1/blog", blogRoute_1.default);
app.use("/v1", s3Route_1.default);
//---------------------------------------------------------------
app.get("/health", (req, res) => {
    const date = (0, moment_1.default)().format("YYYY-MM-DD HH:mm:ss");
    res.status(200).send({
        message: "Server is running",
        status_code: 200,
        entry_time: date,
    });
});
app.all("*", (req, res, next) => {
    next(new errors_handler_1.default({
        message: "Route not found",
        message_code: "ROUTE_NOT_FOUND",
    }));
});
app.use((err, req, res, next) => {
    const { message, message_code } = err;
    res.status(500).json({
        error: {
            message: message || "Internal Server Error",
            message_code: message_code || "INTERNAL_SERVER_ERROR",
        },
    });
});
app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${port}`);
});
