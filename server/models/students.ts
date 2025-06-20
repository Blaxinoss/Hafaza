import mongoose, { Document } from "mongoose";




export interface IStudent  extends Document{

    name:string;
    age:number;
    phone:string;
    lastAttendance?:Date;
    photo?:string;
}


const studentSchema = new mongoose.Schema<IStudent>({
    name: { type: String, required: true, trim: true },
    age: { type: Number, required: true},
    photo:{type:String},
    phone:{type:String, required:true, maxlength:11},
    lastAttendance: { type: Date, default: Date.now },

},
{timestamps:true})

const Student = mongoose.model<IStudent>("Student", studentSchema);

export default Student;