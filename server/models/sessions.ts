// models/Session.ts
import mongoose, { Document } from "mongoose";

export interface ISession extends Document {
  date: Date;

}

const sessionSchema = new mongoose.Schema(
  {
    date: { type: Date, required: true },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<ISession>("Session", sessionSchema);
