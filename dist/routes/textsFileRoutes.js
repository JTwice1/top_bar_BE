"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const textsFileController_1 = require("../controllers/textsFileController");
router.route('/saveFile').post(textsFileController_1.saveFile);
router.route('/getFile').get(textsFileController_1.getFile);
router.route('/sendJSON').get(textsFileController_1.sendJSON);
exports.default = router;
