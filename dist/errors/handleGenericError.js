"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errors_1 = require("../errors");
// import { logger } from '../app';
const handleGenericError = (error, req, res, next, nameOfFunction) => {
    // logger.warn(`Warning: ${nameOfFunction}: (general Error)`);
    // logger.error(error);
    return next(new errors_1.CustomAPIError());
};
exports.default = handleGenericError;
