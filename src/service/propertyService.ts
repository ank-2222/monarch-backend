import Property, { IProperty } from "../models/property";

export class PropertyService {
  async createProperty(data: IProperty): Promise<IProperty> {
    return await Property.create(data);
  }

  async getAllProperties(
    page: number = 1,
    limit: number = 10,
    filters: {
      city?: string;
      area?: string;
      minPrice?: number;
      maxPrice?: number;
      minSize?: number;
      maxSize?: number;
      bedrooms?: number;
      bathrooms?: number;
      furnished?: boolean;
      property_type?: string;
      listing_type?: string;
      location?: string;
      sortBy?: string; // e.g., price, size_sqm, year_built
      sortOrder?: "asc" | "desc"; // Sorting direction
    }
  ): Promise<{ properties: IProperty[]; total: number; totalPages: number }> {
    const query: any = {};

    // Location filter
    if (filters.city) query["location.city"] = filters.city;
    if (filters.area) query["location.area"] = filters.area;

    // Price filter
    if (filters.minPrice || filters.maxPrice) {
      query.price = {};
      if (filters.minPrice) query.price.$gte = filters.minPrice;
      if (filters.maxPrice) query.price.$lte = filters.maxPrice;
    }

    // Size filter
    if (filters.minSize || filters.maxSize) {
      query.size_sqm = {};
      if (filters.minSize) query.size_sqm.$gte = filters.minSize;
      if (filters.maxSize) query.size_sqm.$lte = filters.maxSize;
    }

    // Other filters
    if (filters.bedrooms) query.bedrooms = filters.bedrooms;
    if (filters.bathrooms) query.bathrooms = filters.bathrooms;
    if (filters.furnished !== undefined) query.furnished = filters.furnished;
    if (filters.property_type) query.property_type = filters.property_type;
    if (filters.listing_type) query.listing_type = filters.listing_type;
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
    const sort: any = {};
    if (filters.sortBy) {
      sort[filters.sortBy] = filters.sortOrder === "asc" ? 1 : -1;
    }

    // Pagination logic
    const skip = (page - 1) * limit;

    // Fetch properties with pagination and filters
    const properties = await Property.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .exec();

    // Total count (for pagination)
    const total = await Property.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    return { properties, total, totalPages };
  }

  async getPropertyById(id: string): Promise<IProperty | null> {
    return await Property.findById(id);
  }

  async updateProperty(
    id: string,
    updates: Partial<IProperty>
  ): Promise<IProperty | null> {
    const existingProperty = await Property.findById(id);

    if (!existingProperty) {
      throw new Error("Property not found");
    }

    const mergedUpdates = {
      ...existingProperty.toObject(),
      ...updates,
      location: {
        ...existingProperty.location,
        ...updates.location,
      },
    };

    return await Property.findByIdAndUpdate(
      id,
      { $set: mergedUpdates },
      { new: true, runValidators: true }
    );
  }

  async deleteProperty(id: string): Promise<IProperty | null> {
    return await Property.findByIdAndDelete(id);
  }
}
