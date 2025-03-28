import mongoose, { Schema, Document, Model } from "mongoose";

export interface IAgent extends Document {
  name: string;
  area: string;
  expertise: string[];
  profile_pic: string;
}

const AgentSchema = new Schema<IAgent>(
  {
    name: { type: String, required: true },
    area: { type: String, required: true },
    expertise: [{ type: String, required: true }], // Array of expertise
    profile_pic: { type: String, required: true }, // URL for profile pic
  },
  { timestamps: true }
);

export const Agent: Model<IAgent> = mongoose.model<IAgent>("Agent", AgentSchema);
