"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const custom_api_1 = __importDefault(require("../errors/custom-api"));
const errorHandler = (err, req, res, next) => {
    console.error(err);
    if (err instanceof custom_api_1.default) {
        return res.status(err.statusCode || 500).json({ error: err.message });
    }
    res.status(500).json({ error: 'Something went wrong on the server.' });
};
exports.default = errorHandler;
