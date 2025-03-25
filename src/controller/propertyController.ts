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
        status: 500,
      });
    }
  }

  async getAllProperties(req: Request, res: Response): Promise<IApiResponse<any>> {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;

      const filters = {
        location: req.query.location ? String(req.query.location) : undefined,
        city: req.query.city ? String(req.query.city) : undefined,
        area: req.query.area ? String(req.query.area) : undefined,
        minPrice: req.query.minPrice ? Number(req.query.minPrice) : undefined,
        maxPrice: req.query.maxPrice ? Number(req.query.maxPrice) : undefined,
        minSize: req.query.minSize ? Number(req.query.minSize) : undefined,
        maxSize: req.query.maxSize ? Number(req.query.maxSize) : undefined,
        bedrooms: req.query.bedrooms ? Number(req.query.bedrooms) : undefined,
        bathrooms: req.query.bathrooms
          ? Number(req.query.bathrooms)
          : undefined,
        furnished: req.query.furnished
          ? req.query.furnished === "true"
          : undefined,
        property_type: req.query.property_type
          ? String(req.query.property_type)
          : undefined,
        listing_type: req.query.listing_type
          ? String(req.query.listing_type)
          : undefined,
        sortBy: req.query.sortBy ? String(req.query.sortBy) : undefined,
        sortOrder:
          req.query.sortOrder === "asc" || req.query.sortOrder === "desc"
            ? (req.query.sortOrder as "asc" | "desc")
            : undefined,
      };

      const { properties, total, totalPages } =
        await propertyService.getAllProperties(page, limit, filters);

      const response: IApiResponse<any> = {
        message: "Properties retrieved successfully",
        data: {
          properties,
          pagination: {
            total,
            totalPages,
            currentPage: page,
            limit,
          },
        },
        message_code: "PROPERTIES_RETRIEVED",
      };
      return response;
    } catch (error: any) {
      throw new ErrorHandler({
        message: error.message,
        message_code: "ERROR_FETCHING_PROPERTIES",
        status: 500,
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
          status: 404,
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
        status: 500,
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
          status: 404,
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
        status: 500,
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
          status: 404,
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
        status: 500,
      });
    }
  }
}
