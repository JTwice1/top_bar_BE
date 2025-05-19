"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_codes_1 = require("http-status-codes");
class CustomAPIError extends Error {
    constructor(message) {
        super(message || 'Something went wrong, Internal Server Error (CustomAPIError))');
        this.statusCode = http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR;
    }
}
exports.default = CustomAPIError;
