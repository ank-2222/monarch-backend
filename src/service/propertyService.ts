import Property, { IProperty } from "../models/property";

export class PropertyService {
  async createProperty(data: IProperty): Promise<IProperty> {
    return await Property.create(data);
  }

  async getAllProperties(): Promise<IProperty[]> {
    return await Property.find();
  }

  async getPropertyById(id: string): Promise<IProperty | null> {
    return await Property.findById(id);
  }

  async updateProperty(id: string, updates: Partial<IProperty>): Promise<IProperty | null> {
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
