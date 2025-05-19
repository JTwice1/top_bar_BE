"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const handleGenericError_1 = __importDefault(require("../errors/handleGenericError"));
const asyncWrapper = (fn) => {
    return async (req, res, next) => {
        try {
            await fn(req, res, next);
        }
        catch (error) {
            (0, handleGenericError_1.default)(error, req, res, next, fn.name);
        }
    };
};
exports.default = asyncWrapper;
