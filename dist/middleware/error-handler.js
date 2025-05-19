"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_codes_1 = require("http-status-codes");
const errorHandler = (err, req, res, next) => {
    let customError = {
        name: err.name || 'CustomError',
        // set default
        statusCode: err.statusCode || http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
        message: err.message ||
            'Something went wrong try again later (CustomError - Middleware Error Handler))',
    };
    if (err.name === 'ValidationError') {
        const validationError = err;
        customError.message = Object.values(validationError.errors || {})
            .map((item) => item.message)
            .join(',');
        customError.statusCode = 400;
    }
    if (err.code && err.code === 11000) {
        customError.message = `Duplicate value entered for ${Object.keys(err.keyValue || {})} field, please choose another value`;
        customError.statusCode = 400;
    }
    if (err.name === 'CastError') {
        const castError = err;
        customError.message = `No item found with id : ${castError.value}`;
        customError.statusCode = 404;
    }
    return res.status(customError.statusCode).json({ msg: customError.message });
};
exports.default = errorHandler;
