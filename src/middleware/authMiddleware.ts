import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { Admin } from "../models/Admin";

export interface AuthRequest extends Request {
  user?: any;
}

export const protectAdmin = (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    return new Promise(async (resolve, reject) => {
      const token = req.cookies.authToken;
     
      // const token = req.headers.authorization?.split(" ")[1];
  
      if (!token) {
        res.status(401).json({ message: "Not authorized, no token" , message_code: "NO_TOKEN"});
        return reject();
      }
  
      try {
        const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
        req.user = await Admin.findById(decoded.id).select("-password");
        resolve();
        next();
      } catch (error) {
        res.status(401).json({ message: "Not authorized, token failed", message_code: "TOKEN_FAILED" });
        reject();
      }
    });
  };
  
