"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// models/Session.ts
var mongoose_1 = require("mongoose");
var sessionSchema = new mongoose_1.default.Schema({
    date: { type: Date, required: true },
}, {
    timestamps: true,
});
exports.default = mongoose_1.default.model("Session", sessionSchema);
