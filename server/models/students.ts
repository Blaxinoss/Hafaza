import mongoose, { Document } from "mongoose";


const sessionSchema = new mongoose.Schema({
    date: { type: Date, default: Date.now },
    surahs:[
        {
        name:{type:String , required:true},
        ayasCount:{type:Number , required:true}
    }],
    evaluation: { type: String, enum: ["ممتاز", "جيد جدًا", "جيد", "ضعيف"], required: true },
    notes: { type: String }

})

export interface IStudent  extends Document{

    name:string;
    age:number;
    phone:number;
    lastAttendance?:Date;
    photo?:Blob;
    sessions:typeof sessionSchema[];
}


const studentSchema = new mongoose.Schema<IStudent>({
    name: { type: String, required: true, trim: true },
    age: { type: Number, required: true},
    sessions: [sessionSchema],
    photo:{type:String},
    phone:{type:Number, required:true, maxlength:11},
    lastAttendance: { type: Date, default: Date.now },

},
{timestamps:true})

const Student = mongoose.model<IStudent>("Student", studentSchema);

export default Student;