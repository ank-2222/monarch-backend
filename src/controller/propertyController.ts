import { Request, Response } from "express";
import { PropertyService } from "../service/propertyService";
import ErrorHandler from "../utils/errors.handler";
import { IApiResponse } from "../interface/apiResponse";
import { errorHandler } from "../utils/res.error";

const propertyService = new PropertyService();

export class PropertyController {
  public execute = async (req: Request, res: Response) => {
    try {
      const method = req.method;
      const path = req.route.path;
      const id = req.params.id;

      if (path === "/") {
        if (method === "POST") {
          const result = await this.createProperty(req, res);
          res.status(201).json(result);
        } else if (method === "GET") {
          const result = await this.getAllProperties(req, res);
          res.status(200).json(result);
        }
      } else if (path === "/:id" && id) {
        if (method === "GET") {
          const result = await this.getPropertyById(req, res);
          res.status(200).json(result);
        } else if (method === "PUT") {
          const result = await this.updateProperty(req, res);
          res.status(200).json(result);
        } else if (method === "DELETE") {
          const result = await this.deleteProperty(req, res);
          res.status(200).json(result);
        }
      }
    } catch (error: any) {
      errorHandler(error, req, res);
    }
  };

  async createProperty(
    req: Request,
    res: Response
  ): Promise<IApiResponse<any>> {
    try {
      const property = await propertyService.createProperty(req.body);
      const response: IApiResponse<any> = {
        message: "Property created successfully",
        data: property,
        message_code: "PROPERTY_CREATED",
      };
      return response;
    } catch (error: any) {
      throw new ErrorHandler({
        message: error.message,
        message_code: "ERROR_CREATING_PROPERTY",
      });
    }
  }

  async getAllProperties(
    req: Request,
    res: Response
  ): Promise<IApiResponse<any>> {
    try {
      const properties = await propertyService.getAllProperties();
      const response: IApiResponse<any> = {
        message: "Properties retrieved successfully",
        data: properties,
        message_code: "PROPERTIES_RETRIEVED",
      };
      return response;
    } catch (error: any) {
      throw new ErrorHandler({
        message: error.message,
        message_code: "ERROR_FETCHING_PROPERTIES",
        data: error,
      });
    }
  }

  async getPropertyById(
    req: Request,
    res: Response
  ): Promise<IApiResponse<any>> {
    try {
      const property = await propertyService.getPropertyById(req.params.id);
      if (!property) {
        throw new ErrorHandler({
          message: "Property not found",
          message_code: "PROPERTY_NOT_FOUND",
        });
      }
      const response: IApiResponse<any> = {
        message: "Property retrieved successfully",
        data: property,
        message_code: "PROPERTY_RETRIEVED",
      };
      return response;
    } catch (error: any) {
      throw new ErrorHandler({
        message: error.message,
        message_code: "ERROR_FETCHING_PROPERTY",
        data: error,
      });
    }
  }

  async updateProperty(
    req: Request,
    res: Response
  ): Promise<IApiResponse<any>> {
    try {
      const property = await propertyService.updateProperty(
        req.params.id,
        req.body
      );
      if (!property) {
        throw new ErrorHandler({
          message: "Property not found",
          message_code: "PROPERTY_NOT_FOUND",
        });
      }
      const response: IApiResponse<any> = {
        message: "Property updated successfully",
        data: property,
        message_code: "PROPERTY_UPDATED",
      };
      return response;
    } catch (error: any) {
      throw new ErrorHandler({
        message: error.message,
        message_code: "ERROR_UPDATING_PROPERTY",
        data: error,
      });
    }
  }

  async deleteProperty(
    req: Request,
    res: Response
  ): Promise<IApiResponse<any>> {
    try {
      const property = await propertyService.deleteProperty(req.params.id);
      if (!property) {
        throw new ErrorHandler({
          message: "Property not found",
          message_code: "PROPERTY_NOT_FOUND",
        });
      }
      const response: IApiResponse<any> = {
        message: "Property deleted successfully",
        data: null,
        message_code: "PROPERTY_DELETED",
      };
      return response;
    } catch (error: any) {
      throw new ErrorHandler({
        message: error.message,
        message_code: "ERROR_DELETING_PROPERTY",
        data: error,
      });
    }
  }
}
