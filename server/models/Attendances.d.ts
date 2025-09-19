import mongoose from "mongoose";
export interface IAttendance extends Document {
    student: mongoose.Types.ObjectId;
    session: mongoose.Types.ObjectId;
    isPresent: boolean;
    surahs: {
        name: string;
        fromAya: number;
        toAya: number;
    }[];
    evaluation?: "ممتاز" | "جيد جدًا" | "جيد" | "ضعيف";
    notes?: string;
}
declare const Attendance: mongoose.Model<IAttendance, {}, {}, {}, mongoose.Document<unknown, {}, IAttendance, {}, {}> & IAttendance & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, any>;
export default Attendance;
//# sourceMappingURL=Attendances.d.ts.map