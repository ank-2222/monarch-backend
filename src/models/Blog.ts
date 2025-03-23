import mongoose, { Schema, Document } from "mongoose";

export interface IBlog extends Document {
  title: string;
  content: string;
  coverImage: string;
  additionalImages?: string[];
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    tags?: string[];
    slug?: string;
  };
  author: mongoose.Types.ObjectId;
  status: "draft" | "published";
}

const BlogSchema = new Schema<IBlog>(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    coverImage: { type: String, required: true },
    additionalImages: { type: [String], default: [] },
    seo: {
      metaTitle: { type: String, required: false },
      metaDescription: { type: String, required: false },
      tags: { type: [String], required: false },
    },
    author: { type: Schema.Types.ObjectId, ref: "Admin", required: true },
    status: { type: String, enum: ["draft", "published"], default: "draft" },
  },
  { timestamps: true }
);

export const Blog = mongoose.model<IBlog>("Blog", BlogSchema);
