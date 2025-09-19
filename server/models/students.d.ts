import mongoose, { Document } from "mongoose";
export interface IStudent extends Document {
    name: string;
    age: number;
    phone: string;
    lastAttendance?: Date;
    photo?: string;
}
declare const Student: mongoose.Model<IStudent, {}, {}, {}, mongoose.Document<unknown, {}, IStudent, {}, {}> & IStudent & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default Student;
//# sourceMappingURL=students.d.ts.map