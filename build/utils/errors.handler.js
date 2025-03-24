"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ErrorHandler extends Error {
    constructor(errorObj) {
        super(errorObj.message);
        this.status = 500;
        this.message = errorObj.message;
        this.data = errorObj.data;
        this.message_code = errorObj.message_code;
        this.status = errorObj.status || 500;
        // Capture the error's stack trace, excluding this constructor.
        // Simplifies error messages to show only relevant code for easier debugging.
        Error.captureStackTrace(this, this.constructor);
    }
    toString() {
        return {
            message: this.message,
            data: this.data,
            message_code: this.message_code,
            status: this.status,
        };
    }
}
exports.default = ErrorHandler;
