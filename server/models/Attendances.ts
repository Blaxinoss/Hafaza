// models/Attendance.ts
import mongoose, { Document } from "mongoose";

export interface IAttendance extends Document {
  student: mongoose.Types.ObjectId;
  teacher: mongoose.Types.ObjectId;
  session: mongoose.Types.ObjectId;
  isPresent: boolean;
  surahs: { name: string; fromAya: number
toAya: number }[];
  evaluation?: "ممتاز" | "جيد جدًا" | "جيد" | "ضعيف";
  notes?: string;
}

const attendanceSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher", required: true },
  session :{type:mongoose.Schema.Types.ObjectId, ref:"Session", required:true},
  isPresent: { type: Boolean, required: true },
  surahs: {type : Array,required:true},
  evaluation: { type: String, enum: ['ممتاز', 'جيد جدًا', 'جيد', 'ضعيف'] },
  notes: { type: String }
});

attendanceSchema.index(
  { session: 1, student: 1 },
  { unique: true }
);


const Attendance = mongoose.model<IAttendance>("Attendance",attendanceSchema);
export default Attendance;
