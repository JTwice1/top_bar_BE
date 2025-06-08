"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendActualJSON = exports.sendJSON = exports.getFile = exports.saveFile = void 0;
const http_status_codes_1 = require("http-status-codes");
const errors_1 = require("../errors");
const asyncWrapper_1 = __importDefault(require("../middleware/asyncWrapper"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const promises_1 = __importDefault(require("fs/promises"));
const saveFile = (0, asyncWrapper_1.default)(async (req, res, next) => {
    const { content, email, password } = req.body;
    if (!content) {
        return next(new errors_1.CustomAPIError('Nie je zadaný obsah'));
    }
    if (!email || !password) {
        return next(new errors_1.CustomAPIError('Zadajte Email a heslo'));
    }
    if (email !== process.env.EMAIL || password !== process.env.PASSWORD) {
        return next(new errors_1.CustomAPIError('Chybný email a heslo'));
    }
    const jsFilePath = path_1.default.join(__dirname, '../uploads/topBarTextsWork.js');
    // Path for the JSON file
    const jsonFilePath = path_1.default.join(__dirname, '../uploads/topBarTexts.json');
    let jsonData;
    try {
        const match = content.match(/=\s*(\{[\s\S]*\});?$/);
        if (!match || !match[1]) {
            return next(new errors_1.CustomAPIError('Nepodarilo sa spracovať obsah pre JSON.'));
        }
        jsonData = JSON.parse(match[1]);
    }
    catch (err) {
        return next(new errors_1.CustomAPIError('Neplatný formát JSON dát.'));
    }
    // Write both files
    try {
        fs_1.default.writeFileSync(jsFilePath, content, 'utf8');
        fs_1.default.writeFileSync(jsonFilePath, JSON.stringify(jsonData, null, 2), 'utf8');
        res
            .status(http_status_codes_1.StatusCodes.OK)
            .json({ message: 'Súbor bol úspešne uložený.' });
    }
    catch (err) {
        return next(new errors_1.CustomAPIError('Nepodarilo sa zapísať súbor.'));
    }
});
exports.saveFile = saveFile;
const getFile = (0, asyncWrapper_1.default)(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return next(new errors_1.CustomAPIError('Zadajte Email a heslo'));
    }
    if (email !== process.env.EMAIL || password !== process.env.PASSWORD) {
        return next(new errors_1.CustomAPIError('Chybný email a heslo'));
    }
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
const sendJSON = (0, asyncWrapper_1.default)(async (req, res, next) => {
    const filePath = path_1.default.join(__dirname, '../uploads/topBarTexts.json');
    const data = await promises_1.default.readFile(filePath, 'utf8');
    if (!data) {
        return next(new errors_1.NotFoundError('File not found or empty'));
    }
    const parsed = JSON.parse(data);
    res.status(http_status_codes_1.StatusCodes.OK).json(parsed);
});
exports.sendJSON = sendJSON;
const sendActualJSON = (0, asyncWrapper_1.default)(async (req, res, next) => {
    const filePath = path_1.default.join(__dirname, '../uploads/topBarTexts.json');
    const data = await promises_1.default.readFile(filePath, 'utf8');
    if (!data) {
        return next(new errors_1.NotFoundError('File not found or empty'));
    }
    function toFullISO(dateStr) {
        // If it already contains seconds, return as is
        if (dateStr.match(/T\d{2}:\d{2}:\d{2}$/))
            return dateStr;
        // If it contains just hours and minutes, add ":00"
        if (dateStr.match(/T\d{2}:\d{2}$/))
            return `${dateStr}:00`;
        return dateStr; // Fallback
    }
    const parsed = JSON.parse(data);
    const now = Date.now();
    const filtered = Object.fromEntries(Object.entries(parsed).map(([lang, entries]) => {
        const validEntries = entries.filter((entry) => {
            const startDate = new Date(toFullISO(entry.startDate));
            const endDate = new Date(toFullISO(entry.endDate));
            return (!isNaN(startDate.getTime()) &&
                !isNaN(endDate.getTime()) &&
                startDate.getTime() < now &&
                endDate.getTime() > now);
        });
        return [lang, validEntries];
    }));
    res.status(http_status_codes_1.StatusCodes.OK).json(filtered);
});
exports.sendActualJSON = sendActualJSON;
