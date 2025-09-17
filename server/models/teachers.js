"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var teacherSchema = new mongoose_1.default.Schema({
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
}, { timestamps: true });
var Teacher = mongoose_1.default.model("Teacher", teacherSchema);
exports.default = Teacher;
