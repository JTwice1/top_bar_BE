// errorHandler.ts
import { Request, Response, NextFunction } from 'express';
import CustomAPIError from '../errors/custom-api';

const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err);

  if (err instanceof CustomAPIError) {
    return res.status(err.statusCode || 500).json({ error: err.message });
  }

  res.status(500).json({ error: 'Something went wrong on the server.' });
};

export default errorHandler;
