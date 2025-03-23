import { Request, Response } from "express";
import { BlogService } from "../service/blogService";
import ErrorHandler from "../utils/errors.handler";
import { IApiResponse } from "../interface/apiResponse";
import { errorHandler } from "../utils/res.error";

const blogService = new BlogService();

export class BlogController  {
    public execute = async (req: Request, res: Response) => {
        try {
            const method = req.method;
            const path = req.route.path; 
            const id = req.params.id;
    
            if (path === "/") {
                if (method === "POST") {
                    const result = await this.createBlog(req, res);
                    res.status(201).json(result);
                } else if (method === "GET") {
                    const result = await this.getBlogs(req, res);
                    res.status(200).json(result);
                }
            } else if (path === "/:id" && id) {
                if (method === "GET") {
                    const result = await this.getBlogById(req, res);
                    res.status(200).json(result);
                } else if (method === "PUT") {
                    const result = await this.updateBlog(req, res);
                    res.status(200).json(result);
                } else if (method === "DELETE") {
                    const result = await this.deleteBlog(req, res);
                    res.status(200).json(result);
                }
            } else if (path === "/status/:id" && id) {
                if (method === "PATCH") {
                    const result = await this.togglePublish(req, res);
                    res.status(200).json(result);
                }
            }
        } catch (error: any) {
            errorHandler(error, req, res);
        }
    };
    
  async createBlog(req: Request, res: Response): Promise<IApiResponse<any>> {
    try {
      const { user }: any = req;
      const blog = await blogService.createBlog({
        ...req.body,
        author: user.id,
      });
      return({
        message: "Blog created successfully",
        message_code: "BLOG_CREATED",
        data: blog,
      });
    } catch (error: any) {
      throw new ErrorHandler({
        message: error.message,
        message_code: "ERROR_CREATING_BLOG",
      });
    }
  }

  async getBlogs(req: Request, res: Response): Promise<IApiResponse<any>> {
    try {
      const blogs = await blogService.getBlogs();
      return({
        message: "Blogs retrieved successfully",
        message_code: "BLOGS_RETRIEVED",
        data: blogs,
      });
    } catch (error: any) {
      throw new ErrorHandler({
        message: error.message,
        message_code: "ERROR_FETCHING_BLOG",
      });
    }
  }

  async getBlogById(req: Request, res: Response): Promise<IApiResponse<any>> {
    try {
      const blog = await blogService.getBlogById(req.params.id);
      if (!blog) {
        throw new ErrorHandler({
          message: "Blog not found",
          message_code: "BLOG_NOT_FOUND",
        });
      }
      return({
        message: "Blog retrieved successfully",
        message_code: "BLOG_RETRIEVED",
        data: blog,
      });
    } catch (error: any) {
      throw new ErrorHandler({
        message: error.message,
        message_code: "ERROR_FETCHING_BLOG",
      });
    }
  }

  async updateBlog(req: Request, res: Response): Promise<IApiResponse<any>> {
    try {
      const blog = await blogService.updateBlog(req.params.id, req.body);
      if (!blog) {
        throw new ErrorHandler({
          message: "Blog not found",
          message_code: "BLOG_NOT_FOUND",
        });
      }
      return({
        message: "Blog updated successfully",
        message_code: "BLOG_UPDATED",
        data: blog,
      });
    } catch (error: any) {
      throw new ErrorHandler({
        message: error.message,
        message_code: "ERROR_UPDATING_BLOG",
      });
    }
  }

  async deleteBlog(req: Request, res: Response):Promise<IApiResponse<any>> {
    try {
      const message = await blogService.deleteBlog(req.params.id);
      return({
        message: message,
        message_code: "BLOG_DELETED",
        data: null,
      });
    } catch (error: any) {
      throw new ErrorHandler({
        message: error.message,
        message_code: "ERROR_DELETING_BLOG",
      });
    }
  }

  async togglePublish(req: Request, res: Response): Promise<IApiResponse<any>> {
    try {
      const blog = await blogService.togglePublish(
        req.params.id,
        req.body.status
      );
      if (!blog) {
        throw new ErrorHandler({
          message: "Blog not found",
          message_code: "BLOG_NOT_FOUND",
        });
      }
      return({
        message: "Blog updated successfully",
        message_code: "BLOG_UPDATED",
        data: blog,
      });
    } catch (error: any) {
      throw new ErrorHandler({
        message: error.message,
        message_code: "ERROR_TOGGLING_BLOG",
      });
    }
  }
}
