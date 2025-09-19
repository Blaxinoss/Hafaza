import mongoose, { Document } from "mongoose";
export interface ITeacher extends Document {
    name: string;
    phone: string;
    lastAttendance?: Date;
}
declare const Teacher: mongoose.Model<ITeacher, {}, {}, {}, mongoose.Document<unknown, {}, ITeacher, {}, {}> & ITeacher & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default Teacher;
//# sourceMappingURL=teachers.d.ts.map