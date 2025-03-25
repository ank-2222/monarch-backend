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
exports.PropertyService = void 0;
const property_1 = __importDefault(require("../models/property"));
class PropertyService {
    createProperty(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield property_1.default.create(data);
        });
    }
    getAllProperties() {
        return __awaiter(this, arguments, void 0, function* (page = 1, limit = 10, filters) {
            const query = {};
            // Location filter
            if (filters.city)
                query["location.city"] = filters.city;
            if (filters.area)
                query["location.area"] = filters.area;
            // Price filter
            if (filters.minPrice || filters.maxPrice) {
                query.price = {};
                if (filters.minPrice)
                    query.price.$gte = filters.minPrice;
                if (filters.maxPrice)
                    query.price.$lte = filters.maxPrice;
            }
            // Size filter
            if (filters.minSize || filters.maxSize) {
                query.size_sqm = {};
                if (filters.minSize)
                    query.size_sqm.$gte = filters.minSize;
                if (filters.maxSize)
                    query.size_sqm.$lte = filters.maxSize;
            }
            // Other filters
            if (filters.bedrooms)
                query.bedrooms = filters.bedrooms;
            if (filters.bathrooms)
                query.bathrooms = filters.bathrooms;
            if (filters.furnished !== undefined)
                query.furnished = filters.furnished;
            if (filters.property_type)
                query.property_type = filters.property_type;
            if (filters.listing_type)
                query.listing_type = filters.listing_type;
            if (filters.city) {
                query["location.city"] = { $regex: filters.city, $options: "i" };
            }
            if (filters.area) {
                query["location.area"] = { $regex: filters.area, $options: "i" };
            }
            // If searching for a generic location match across city or area
            if (filters.location) {
                query.$or = [
                    { "location.city": { $regex: filters.location, $options: "i" } },
                    { "location.area": { $regex: `\\b${filters.location}\\b`, $options: "i" } } // Ensures word match
                ];
            }
            // Sorting
            const sort = {};
            if (filters.sortBy) {
                sort[filters.sortBy] = filters.sortOrder === "asc" ? 1 : -1;
            }
            // Pagination logic
            const skip = (page - 1) * limit;
            // Fetch properties with pagination and filters
            const properties = yield property_1.default.find(query)
                .sort(sort)
                .skip(skip)
                .limit(limit)
                .exec();
            // Total count (for pagination)
            const total = yield property_1.default.countDocuments(query);
            const totalPages = Math.ceil(total / limit);
            return { properties, total, totalPages };
        });
    }
    getPropertyById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield property_1.default.findById(id);
        });
    }
    updateProperty(id, updates) {
        return __awaiter(this, void 0, void 0, function* () {
            const existingProperty = yield property_1.default.findById(id);
            if (!existingProperty) {
                throw new Error("Property not found");
            }
            const mergedUpdates = Object.assign(Object.assign(Object.assign({}, existingProperty.toObject()), updates), { location: Object.assign(Object.assign({}, existingProperty.location), updates.location) });
            return yield property_1.default.findByIdAndUpdate(id, { $set: mergedUpdates }, { new: true, runValidators: true });
        });
    }
    deleteProperty(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield property_1.default.findByIdAndDelete(id);
        });
    }
}
exports.PropertyService = PropertyService;
