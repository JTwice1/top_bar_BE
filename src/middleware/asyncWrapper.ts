import { Request, Response, NextFunction } from 'express';
import handleGenericError from '../errors/handleGenericError';

const asyncWrapper = (fn: Function) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await fn(req, res, next);
    } catch (error: any) {
      handleGenericError(error, req, res, next, fn.name);
    }
  };
};

export default asyncWrapper;
