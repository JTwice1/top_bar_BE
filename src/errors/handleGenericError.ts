import { Request, Response, NextFunction } from 'express';
import { CustomAPIError } from '../errors';
// import { logger } from '../app';

const handleGenericError = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction,
  nameOfFunction: string
) => {
  // logger.warn(`Warning: ${nameOfFunction}: (general Error)`);
  // logger.error(error);
  return next(new CustomAPIError());
};

export default handleGenericError;
