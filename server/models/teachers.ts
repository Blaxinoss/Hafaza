import mongoose, { Document } from "mongoose";

// Define the interface for Teacher
export interface ITeacher extends Document {
    name: string;
    phone: string;
    lastAttendance?: Date; 
}

const teacherSchema = new mongoose.Schema<ITeacher>(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        phone: {
            type: String,
            required: true,
            unique: true,
        },
        lastAttendance: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: true } 
);

const Teacher = mongoose.model<ITeacher>("Teacher", teacherSchema);
export default Teacher;
