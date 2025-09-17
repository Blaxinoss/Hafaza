"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// models/Attendance.ts
var mongoose_1 = require("mongoose");
var attendanceSchema = new mongoose_1.default.Schema({
    student: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "Student", required: true },
    session: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "Session", required: true },
    isPresent: { type: Boolean, required: true },
    surahs: [
        {
            name: { type: String },
            ayasCount: { type: Number },
        },
    ],
    evaluation: { type: String, enum: ['ممتاز', 'جيد جدًا', 'جيد', 'ضعيف'] },
    notes: { type: String }
});
var Attendance = mongoose_1.default.model("Attendance", attendanceSchema);
exports.default = Attendance;
