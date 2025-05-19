import express, { Request, Response } from 'express';

// import morgan from 'morgan';
// import winston from 'winston';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import xss from 'xss';
import hpp from 'hpp';

const app = express();

app.set('trust proxy', 1);

//SECURITY
//-----------------------------------------------------
//Define rate limiting rules
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Apply rate limiting to all requests
app.use(limiter);
// Set security headers
app.use(helmet());
// Prevent XSS attacks
// Sanitize request inputs (query, body, and params) safely
const sanitizeRequest = (req: Request, res: Response, next: any) => {
  const sanitize = (obj: any) => {
    if (obj && typeof obj === 'object') {
      for (const key in obj) {
        if (typeof obj[key] === 'string') {
          obj[key] = xss(obj[key]);
        } else if (typeof obj[key] === 'object') {
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
app.use(hpp());
//-------------------------------------------------------------

//Logging middleware for development environment
// const { combine, timestamp, simple } = winston.format;

// export const logger = winston.createLogger({
//   level: 'info',
//   format: combine(timestamp(), simple()),
//   transports: [
//     new winston.transports.File({
//       filename: './serverLogs/error.log',
//       level: 'error',
//     }),
//     new winston.transports.File({
//       filename: './serverLogs/warn.log',
//       level: 'warn',
//     }),
//     new winston.transports.File({
//       filename: './serverLogs/combined.log',
//     }),
//   ],
// });

// if (process.env.NODE_ENV === 'development') {
//   logger.add(
//     new winston.transports.Console({
//       format: combine(timestamp(), winston.format.simple()),
//     })
//   );
//   const stream = {
//     write: (message: any) => logger.info(message.trim()),
//   };
//   app.use(morgan('tiny', { stream }));
// }

//CORS configuration
const corsOptions = {
  origin:
    process.env.NODE_ENV === 'production'
      ? 'https://www.top-bar-texts.onrender.com'
      : 'http://localhost:5173',
  credentials: true,
};
app.use(cors(corsOptions));

// Limit the amount of data that can be sent in a request body
app.use(express.json({ limit: '10kb' }));

//Routers
import textsFileRouter from './routes/textsFileRoutes';
app.use('/file', textsFileRouter);

// Root route
app.get('/', (req: Request, res: Response) => {
  res.status(200).send('TOP BAR texts creator Server is Running....... 🛰️');
});

export default app;
