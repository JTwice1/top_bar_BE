import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { CustomAPIError, NotFoundError } from '../errors';
import asyncWrapper from '../middleware/asyncWrapper';
import path from 'path';
import fs from 'fs';
import fsPromises from 'fs/promises';

const saveFile = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const { content } = req.body;
    if (!content) {
      return next(new CustomAPIError('Content required'));
    }
    const filePath = path.join(__dirname, '../uploads/topBarTextsWork.js');
    fs.writeFile(filePath, content, 'utf8', (err) => {
      if (err) {
        return next(new CustomAPIError('Failed to write file'));
      }
      res.status(StatusCodes.OK).json({ message: 'File written successfully' });
    });
  }
);

const getFile = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const filePath = path.join(__dirname, '../uploads/topBarTextsWork.js');
    if (fs.existsSync(filePath)) {
      res.setHeader('Content-Type', 'application/javascript');
      res.sendFile(filePath);
    } else {
      return next(new NotFoundError('File not found'));
    }
  }
);

const sendJSON = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const filePath = path.join(__dirname, '../uploads/topBarTexts.json');
    const data = await fsPromises.readFile(filePath, 'utf8');
    if (!data) {
      return next(new NotFoundError('File not found or empty'));
    }
    const parsed = JSON.parse(data);
    res.status(StatusCodes.OK).json(parsed);
  }
);

export { saveFile, getFile, sendJSON };
