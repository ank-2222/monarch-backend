"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PropertyController = void 0;
const propertyService_1 = require("../service/propertyService");
const errors_handler_1 = __importDefault(require("../utils/errors.handler"));
const res_error_1 = require("../utils/res.error");
const propertyService = new propertyService_1.PropertyService();
class PropertyController {
    constructor() {
        this.execute = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const method = req.method;
                const path = req.route.path;
                const id = req.params.id;
                if (path === "/") {
                    if (method === "POST") {
                        const result = yield this.createProperty(req, res);
                        res.status(201).json(result);
                    }
                    else if (method === "GET") {
                        const result = yield this.getAllProperties(req, res);
                        res.status(200).json(result);
                    }
                }
                else if (path === "/:id" && id) {
                    if (method === "GET") {
                        const result = yield this.getPropertyById(req, res);
                        res.status(200).json(result);
                    }
                    else if (method === "PUT") {
                        const result = yield this.updateProperty(req, res);
                        res.status(200).json(result);
                    }
                    else if (method === "DELETE") {
                        const result = yield this.deleteProperty(req, res);
                        res.status(200).json(result);
                    }
                }
            }
            catch (error) {
                (0, res_error_1.errorHandler)(error, req, res);
            }
        });
    }
    createProperty(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const property = yield propertyService.createProperty(req.body);
                const response = {
                    message: "Property created successfully",
                    data: property,
                    message_code: "PROPERTY_CREATED",
                };
                return response;
            }
            catch (error) {
                throw new errors_handler_1.default({
                    message: error.message,
                    message_code: "ERROR_CREATING_PROPERTY",
                    status: 500,
                });
            }
        });
    }
    getAllProperties(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
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
                    sortOrder: req.query.sortOrder === "asc" || req.query.sortOrder === "desc"
                        ? req.query.sortOrder
                        : undefined,
                };
                const { properties, total, totalPages } = yield propertyService.getAllProperties(page, limit, filters);
                const response = {
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
            }
            catch (error) {
                throw new errors_handler_1.default({
                    message: error.message,
                    message_code: "ERROR_FETCHING_PROPERTIES",
                    status: 500,
                });
            }
        });
    }
    getPropertyById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const property = yield propertyService.getPropertyById(req.params.id);
                if (!property) {
                    throw new errors_handler_1.default({
                        message: "Property not found",
                        message_code: "PROPERTY_NOT_FOUND",
                        status: 404,
                    });
                }
                const response = {
                    message: "Property retrieved successfully",
                    data: property,
                    message_code: "PROPERTY_RETRIEVED",
                };
                return response;
            }
            catch (error) {
                throw new errors_handler_1.default({
                    message: error.message,
                    message_code: "ERROR_FETCHING_PROPERTY",
                    status: 500,
                });
            }
        });
    }
    updateProperty(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const property = yield propertyService.updateProperty(req.params.id, req.body);
                if (!property) {
                    throw new errors_handler_1.default({
                        message: "Property not found",
                        message_code: "PROPERTY_NOT_FOUND",
                        status: 404,
                    });
                }
                const response = {
                    message: "Property updated successfully",
                    data: property,
                    message_code: "PROPERTY_UPDATED",
                };
                return response;
            }
            catch (error) {
                throw new errors_handler_1.default({
                    message: error.message,
                    message_code: "ERROR_UPDATING_PROPERTY",
                    data: error,
                    status: 500,
                });
            }
        });
    }
    deleteProperty(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const property = yield propertyService.deleteProperty(req.params.id);
                if (!property) {
                    throw new errors_handler_1.default({
                        message: "Property not found",
                        message_code: "PROPERTY_NOT_FOUND",
                        status: 404,
                    });
                }
                const response = {
                    message: "Property deleted successfully",
                    data: null,
                    message_code: "PROPERTY_DELETED",
                };
                return response;
            }
            catch (error) {
                throw new errors_handler_1.default({
                    message: error.message,
                    message_code: "ERROR_DELETING_PROPERTY",
                    data: error,
                    status: 500,
                });
            }
        });
    }
}
exports.PropertyController = PropertyController;
