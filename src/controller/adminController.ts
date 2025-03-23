import { Request, Response } from "express";
import { Admin } from "../models/Admin";
import { generateToken } from "../utils/generateToken";
import ErrorHandler from "../utils/errors.handler";
import { IApiResponse } from "../interface/apiResponse";
import { errorHandler } from "../utils/res.error";

export class AdminController {
    public execute = async (req: Request, res: Response) => {
        try {
            const method = req.method;
            const path = req.route.path;
            const id = req.params.id;

            if (path === "/register" && method === "POST") {
                const result = await this.register(req, res);
                res.status(201).json(result);
            } else if (path === "/login" && method === "POST") {
                const result = await this.login(req, res);
                res.status(200).json(result);
            } else if (path === "/profile" && method === "GET") {
                const result = await this.getProfile(req, res);
                res.status(200).json(result);
            } else if (path === "/profile" && method === "PUT") {
                const result = await this.updateProfile(req, res);
                res.status(200).json(result);
            } else if (path === "/logout" && method === "POST") {
                const result = await this.logout(req, res);
                res.status(200).json(result);
            }
        } catch (error: any) {
            errorHandler(error, req, res);
        }
    };

    async register(req: Request, res: Response): Promise<IApiResponse<any>> {
        try {
            const { name, email, password } = req.body;
            const existingAdmin = await Admin.findOne({ email });
            if (existingAdmin) {
                throw new ErrorHandler({
                    message: "Admin already exists",
                    message_code: "ADMIN_ALREADY_EXIST",
                });
            }
            const admin: any = await Admin.create({ name, email, password });
            return {
                message: "Admin registered successfully",
                message_code: "ADMIN_REGISTERED",
                data: {
                    name: admin.name,
                    email: admin.email,
                    token: generateToken(admin._id),
                },
            };
        } catch (error: any) {
            throw new ErrorHandler({
                message: error.message,
                message_code: "ERROR_REGISTERING_ADMIN",
            });
        }
    }

    async login(req: Request, res: Response): Promise<IApiResponse<any>> {
        try {
            const { email, password } = req.body;
            const admin: any = await Admin.findOne({ email });
            if (!admin || !(await admin.matchPassword(password))) {
                throw new ErrorHandler({
                    message: "Invalid email or password",
                    message_code: "INVALID_CREDENTIALS",
                });
            }
            return {
                message: "Admin logged in successfully",
                message_code: "ADMIN_LOGGED_IN",
                data: {
                    name: admin.name,
                    email: admin.email,
                    token: generateToken(admin._id),
                },
            };
        } catch (error: any) {
            throw new ErrorHandler({
                message: error.message,
                message_code: "ERROR_LOGGING_IN_ADMIN",
            });
        }
    }

    async getProfile(req: Request, res: Response): Promise<IApiResponse<any>> {
        try {
            const { user }: any = req;
            const admin: any = await Admin.findById(user.id).select("-password");
            if (!admin) {
                throw new ErrorHandler({
                    message: "Admin not found",
                    message_code: "ADMIN_NOT_FOUND",
                });
            }
            return {
                message: "Admin profile retrieved successfully",
                message_code: "ADMIN_PROFILE_RETRIEVED",
                data: admin,
            };
        } catch (error: any) {
            throw new ErrorHandler({
                message: error.message,
                message_code: "ERROR_FETCHING_ADMIN_PROFILE",
            });
        }
    }

    async updateProfile(req: Request, res: Response): Promise<IApiResponse<any>> {
        try {
            const { user }: any = req;
            const admin: any = await Admin.findById(user.id);
            if (!admin) {
                throw new ErrorHandler({
                    message: "Admin not found",
                    message_code: "ADMIN_NOT_FOUND",
                });
            }
            admin.name = req.body.name || admin.name;
            admin.email = req.body.email || admin.email;
            if (req.body.password) {
                admin.password = req.body.password;
            }
            await admin.save();
            return {
                message: "Profile updated successfully",
                message_code: "PROFILE_UPDATED",
                data: {
                    name: admin.name,
                    email: admin.email,
                },
            };
        } catch (error: any) {
            throw new ErrorHandler({
                message: error.message,
                message_code: "ERROR_UPDATING_ADMIN_PROFILE",
            });
        }
    }

    async logout(req: Request, res: Response): Promise<IApiResponse<any>> {
        return {
            message: "Admin logged out successfully",
            message_code: "ADMIN_LOGGED_OUT",
            data: null,
        };
    }
}