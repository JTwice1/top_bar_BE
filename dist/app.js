"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const winston_1 = __importDefault(require("winston"));
const cors_1 = __importDefault(require("cors"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const helmet_1 = __importDefault(require("helmet"));
const xss_1 = __importDefault(require("xss"));
const hpp_1 = __importDefault(require("hpp"));
const app = (0, express_1.default)();
app.set('trust proxy', 1);
//SECURITY
//-----------------------------------------------------
//Define rate limiting rules
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
// Apply rate limiting to all requests
app.use(limiter);
// Set security headers
app.use((0, helmet_1.default)());
// Prevent XSS attacks
// Sanitize request inputs (query, body, and params) safely
const sanitizeRequest = (req, res, next) => {
    const sanitize = (obj) => {
        if (obj && typeof obj === 'object') {
            for (const key in obj) {
                if (typeof obj[key] === 'string') {
                    obj[key] = (0, xss_1.default)(obj[key]);
                }
                else if (typeof obj[key] === 'object') {
                    sanitize(obj[key]);
                }
            }
        }
    };
    sanitize(req.body);
    sanitize(req.query);
    sanitize(req.params);
    next();
};
app.use(sanitizeRequest);
// Prevent HTTP Parameter Pollution
app.use((0, hpp_1.default)());
//-------------------------------------------------------------
//Logging middleware for development environment
const { combine, timestamp, simple } = winston_1.default.format;
exports.logger = winston_1.default.createLogger({
    level: 'info',
    format: combine(timestamp(), simple()),
    transports: [
        new winston_1.default.transports.File({
            filename: './serverLogs/error.log',
            level: 'error',
        }),
        new winston_1.default.transports.File({
            filename: './serverLogs/warn.log',
            level: 'warn',
        }),
        new winston_1.default.transports.File({
            filename: './serverLogs/combined.log',
        }),
    ],
});
if (process.env.NODE_ENV === 'development') {
    exports.logger.add(new winston_1.default.transports.Console({
        format: combine(timestamp(), winston_1.default.format.simple()),
    }));
    const stream = {
        write: (message) => exports.logger.info(message.trim()),
    };
    app.use((0, morgan_1.default)('tiny', { stream }));
}
//CORS configuration
const corsOptions = {
    origin: process.env.NODE_ENV === 'production'
        ? 'https://ruzovy-pasik.netlify.app/'
        : 'http://localhost:5173',
    credentials: true,
};
app.use((0, cors_1.default)(corsOptions));
// Limit the amount of data that can be sent in a request body
app.use(express_1.default.json({ limit: '10kb' }));
//Routers
const textsFileRoutes_1 = __importDefault(require("./routes/textsFileRoutes"));
app.use('/file', textsFileRoutes_1.default);
// Root route
app.get('/', (req, res) => {
    res.status(200).send('TOP BAR texts creator Server is Running....... 🛰️');
});
exports.default = app;
