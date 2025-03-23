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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PropertyController = void 0;
const PropertyService_1 = require("../services/PropertyService");
const propertyService = new PropertyService_1.PropertyService();
class PropertyController {
    createProperty(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const property = yield propertyService.createProperty(req.body);
                res.status(201).json(property);
            }
            catch (error) {
                res.status(500).json({ message: "Error creating property", error });
            }
        });
    }
    getAllProperties(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const properties = yield propertyService.getAllProperties();
                res.status(200).json(properties);
            }
            catch (error) {
                res.status(500).json({ message: "Error fetching properties", error });
            }
        });
    }
    getPropertyById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const property = yield propertyService.getPropertyById(req.params.id);
                if (!property)
                    return res.status(404).json({ message: "Property not found" });
                res.status(200).json(property);
            }
            catch (error) {
                res.status(500).json({ message: "Error fetching property", error });
            }
        });
    }
    updateProperty(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const property = yield propertyService.updateProperty(req.params.id, req.body);
                if (!property)
                    return res.status(404).json({ message: "Property not found" });
                res.status(200).json(property);
            }
            catch (error) {
                res.status(500).json({ message: "Error updating property", error });
            }
        });
    }
    deleteProperty(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const property = yield propertyService.deleteProperty(req.params.id);
                if (!property)
                    return res.status(404).json({ message: "Property not found" });
                res.status(200).json({ message: "Property deleted successfully" });
            }
            catch (error) {
                res.status(500).json({ message: "Error deleting property", error });
            }
        });
    }
}
exports.PropertyController = PropertyController;
