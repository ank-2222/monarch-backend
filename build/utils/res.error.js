"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const pino_1 = __importDefault(require("pino"));
const logger = (0, pino_1.default)({
    transport: {
        target: 'pino-pretty',
        options: {
            colorize: true,
            timeStampKey: 'time',
        }
    }
});
const errors_handler_1 = __importDefault(require("./errors.handler"));
const errorHandler = (err, req, res) => {
    logger.error(err.message);
    if (err instanceof errors_handler_1.default) {
        return res.status(500).json({ message: err.message, message_code: err.message_code, data: err.data });
    }
    return res.status(500).json({ message: "Something went wrong!" });
};
exports.errorHandler = errorHandler;
