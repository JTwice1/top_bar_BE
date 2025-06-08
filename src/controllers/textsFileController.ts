import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { CustomAPIError, NotFoundError } from '../errors';
import asyncWrapper from '../middleware/asyncWrapper';
import path from 'path';
import fs from 'fs';
import fsPromises from 'fs/promises';
import { Entry } from '../types/types';
import { DateTime } from 'luxon';

const saveFile = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const { content, email, password } = req.body;
    if (!content) {
      return next(new CustomAPIError('Nie je zadaný obsah'));
    }
    if (!email || !password) {
      return next(new CustomAPIError('Zadajte Email a heslo'));
    }
    if (email !== process.env.EMAIL || password !== process.env.PASSWORD) {
      return next(new CustomAPIError('Chybný email a heslo'));
    }

    const jsFilePath = path.join(__dirname, '../uploads/topBarTextsWork.js');
    // Path for the JSON file
    const jsonFilePath = path.join(__dirname, '../uploads/topBarTexts.json');
    let jsonData: any;
    try {
      const match = content.match(/=\s*(\{[\s\S]*\});?$/);
      if (!match || !match[1]) {
        return next(
          new CustomAPIError('Nepodarilo sa spracovať obsah pre JSON.')
        );
      }
      jsonData = JSON.parse(match[1]);
    } catch (err) {
      return next(new CustomAPIError('Neplatný formát JSON dát.'));
    }

    // Write both files
    try {
      fs.writeFileSync(jsFilePath, content, 'utf8');
      fs.writeFileSync(jsonFilePath, JSON.stringify(jsonData, null, 2), 'utf8');
      res
        .status(StatusCodes.OK)
        .json({ message: 'Súbor bol úspešne uložený.' });
    } catch (err) {
      return next(new CustomAPIError('Nepodarilo sa zapísať súbor.'));
    }
  }
);

const getFile = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(new CustomAPIError('Zadajte Email a heslo'));
    }
    if (email !== process.env.EMAIL || password !== process.env.PASSWORD) {
      return next(new CustomAPIError('Chybný email a heslo'));
    }
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

// const sendActualJSON = asyncWrapper(
//   async (req: Request, res: Response, next: NextFunction) => {
//     const filePath = path.join(__dirname, '../uploads/topBarTexts.json');
//     const data = await fsPromises.readFile(filePath, 'utf8');

//     if (!data) {
//       return next(new NotFoundError('File not found or empty'));
//     }

//     function toFullISO(dateStr: string): string {
//       // If it already contains seconds, return as is
//       if (dateStr.match(/T\d{2}:\d{2}:\d{2}$/)) return dateStr;
//       // If it contains just hours and minutes, add ":00"
//       if (dateStr.match(/T\d{2}:\d{2}$/)) return `${dateStr}:00`;
//       return dateStr; // Fallback
//     }

//     const parsed = JSON.parse(data);
//     const now = new Date();

//     const filtered = Object.fromEntries(
//       Object.entries(parsed).map(([lang, entries]) => {
//         const validEntries = (entries as Entry[]).filter((entry) => {
//           if (!entry.startDate || !entry.endDate) {
//             return false;
//           }
//           const startDateStr = toFullISO(entry.startDate);
//           const endDateStr = toFullISO(entry.endDate);

//           const startDate = new Date(startDateStr);
//           const endDate = new Date(endDateStr);

//           if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
//             return false; // Skip if either date is invalid
//           }

//           return startDate < now && endDate > now;
//         });
//         return [lang, validEntries];
//       })
//     );

//     res.status(StatusCodes.OK).json(filtered);
//   }
// );
const sendActualJSON = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const filePath = path.join(__dirname, '../uploads/topBarTexts.json');
    const data = await fsPromises.readFile(filePath, 'utf8');

    if (!data) {
      return next(new NotFoundError('File not found or empty'));
    }

    function toFullISO(dateStr: string): string {
      if (dateStr.match(/T\d{2}:\d{2}:\d{2}$/)) return dateStr;
      if (dateStr.match(/T\d{2}:\d{2}$/)) return `${dateStr}:00`;
      return dateStr;
    }

    const parsed = JSON.parse(data);
    const now = DateTime.now().setZone('Europe/Bratislava');

    const filtered = Object.fromEntries(
      Object.entries(parsed).map(([lang, entries]) => {
        const validEntries = (entries as Entry[]).filter((entry) => {
          if (!entry.startDate || !entry.endDate) return false;

          const startDateStr = toFullISO(entry.startDate);
          const endDateStr = toFullISO(entry.endDate);

          const startDate = DateTime.fromISO(startDateStr, {
            zone: 'Europe/Bratislava',
          });
          const endDate = DateTime.fromISO(endDateStr, {
            zone: 'Europe/Bratislava',
          });

          if (!startDate.isValid || !endDate.isValid) return false;

          return startDate < now && endDate > now;
        });
        return [lang, validEntries];
      })
    );

    res.status(StatusCodes.OK).json(filtered);
  }
);

export { saveFile, getFile, sendJSON, sendActualJSON };
