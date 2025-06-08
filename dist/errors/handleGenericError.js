"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errors_1 = require("../errors");
const app_1 = require("../app");
const handleGenericError = (error, req, res, next, nameOfFunction) => {
    app_1.logger.warn(`Warning: ${nameOfFunction}: (general Error)`);
    app_1.logger.error(error);
    return next(new errors_1.CustomAPIError());
};
exports.default = handleGenericError;
