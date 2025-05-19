"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFile = exports.saveFile = void 0;
const http_status_codes_1 = require("http-status-codes");
const errors_1 = require("../errors");
const asyncWrapper_1 = __importDefault(require("../middleware/asyncWrapper"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const saveFile = (0, asyncWrapper_1.default)(async (req, res, next) => {
    const { content } = req.body;
    console.log('Received content:', content);
    if (!content) {
        return next(new errors_1.CustomAPIError('Content required'));
    }
    const filePath = path_1.default.join(__dirname, '../uploads/topBarTextsWork.js');
    fs_1.default.writeFile(filePath, content, 'utf8', (err) => {
        if (err) {
            return next(new errors_1.CustomAPIError('Failed to write file'));
        }
        res.status(http_status_codes_1.StatusCodes.OK).json({ message: 'File written successfully' });
    });
});
exports.saveFile = saveFile;
const getFile = (0, asyncWrapper_1.default)(async (req, res, next) => {
    const filePath = path_1.default.join(__dirname, '../uploads/topBarTextsWork.js');
    if (fs_1.default.existsSync(filePath)) {
        res.setHeader('Content-Type', 'application/javascript');
        res.sendFile(filePath);
    }
    else {
        return next(new errors_1.NotFoundError('File not found'));
    }
});
exports.getFile = getFile;
