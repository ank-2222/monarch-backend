// src/middlewares/errorHandler.ts
import { Request, Response, NextFunction } from "express";
import pino from 'pino';
const logger = pino({
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      timeStampKey: 'time',
    }
  }
})

import ErrorHandler from "./errors.handler";
export const errorHandler = (
  err: Error | ErrorHandler,
  req: Request,
  res: Response,
) => {
  
logger.error(err.message);
  if (err instanceof ErrorHandler) {
    return res.status(err.status).json({ message: err.message, message_code: err.message_code, data: err.data });
  }

  return res.status(500).json({ message: "Something went wrong!" });
};
