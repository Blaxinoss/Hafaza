"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var studentSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true, trim: true },
    age: { type: Number, required: true },
    photo: { type: String },
    phone: { type: String, required: true, maxlength: 11 },
    lastAttendance: { type: Date, default: Date.now },
}, { timestamps: true });
var Student = mongoose_1.default.model("Student", studentSchema);
exports.default = Student;
