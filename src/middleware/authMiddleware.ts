import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { Admin } from "../models/Admin";
import ErrorHandler from "../utils/errors.handler";

export interface AuthRequest extends Request {
  user?: any;
}

export const protectAdmin = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const token = req?.cookies?.authToken || req.headers.authorization?.split(" ")[1];

    if (!token) {
      throw new ErrorHandler({
        message: "No token has been provided",
        message_code: "NO_TOKEN",
      });
    }

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    const user = await Admin.findById(decoded.id).select("-password");

    if (!user) {
      throw new ErrorHandler({
        message: "User not found",
        message_code: "USER_NOT_FOUND",
      });
    }

    req.user = user;
    next(); // Call next() directly without resolve()
  } catch (error) {
    next(
      error instanceof ErrorHandler
        ? error
        : new ErrorHandler({
            message: "Not authorized, token failed",
            message_code: "TOKEN_FAILED",
          })
    );
  }
};
