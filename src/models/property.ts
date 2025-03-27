import mongoose, { Schema, Document } from "mongoose";

interface Location {
  city: string;
  area: string;
  latitude: number;
  longitude: number;
}

export interface IProperty extends Document {
  title: string;
  description: string;
  price: number;
  currency: string;
  location: Location;
  size_sqm: number;
  bedrooms: number;
  bathrooms: number;
  parking_spaces: number;
  amenities: string[];
  images: string[];
  property_type: string;
  furnished: boolean;
  year_built: number;
  listing_type: string;
}

const PropertySchema = new Schema<IProperty>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    currency: { type: String, required: true },
    location: {
      city: { type: String, required: true },
      area: { type: String, required: true },
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true },
    },
    size_sqm: { type: Number, required: true },
    bedrooms: { type: Number, required: true },
    bathrooms: { type: Number, required: true },
    parking_spaces: { type: Number, required: true },
    amenities: [{ type: String }],
    images: [{ type: String }],
    furnished: { type: Boolean, required: true },
    year_built: { type: Number, required: true },
    property_type: {
      type: String,
      required: true,
      enum: ["apartment", "villa", "house"], // Restrict values
    },
    listing_type: {
      type: String,
      required: true,
      enum: ["rent", "sale"], // Restrict values
    },
  },
  { timestamps: true }
);


const Property = mongoose.model<IProperty>("Property", PropertySchema);
export default Property;
