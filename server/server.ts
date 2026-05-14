import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import type { Application, Request, Response, NextFunction } from 'express';

import mongoose from 'mongoose';
import studentsRoute from './routes/studentsRoutes.js';
import teachersRoute from './routes/teachersRoutes.js';
import attendanceRoutes from './routes/attendance.js';
import sessionRoutes from './routes/sessions.js';


dotenv.config();

const app: Application = express();
app.use(express.json())
app.use(cors({
    origin: '*', // اسم الدومين او الايبي اللي مسموح له بالوصول للسيرفر
}));

const port: string | number = process.env.PORT || 3000;

mongoose.connect(process.env.MONGO_URI as string)
    .then(() => console.log("MongoDB connected"))
    .catch((err: any) => console.log(err));

app.get('/', (req: Request, res: Response) => {
    res.send("Hello, World!");
});
app.use('/api/sessions', sessionRoutes);

app.use('/api/attendance', attendanceRoutes);

app.use('/api/teachers', teachersRoute);
app.use('/api/students', studentsRoute);

// 404 handler - should come after all route registrations
app.use('*', (req: Request, res: Response, next: NextFunction) => {
    const error = new Error(`Route ${req.originalUrl} not found`) as any;
    error.statusCode = 404;
    next(error); // Pass the error to the global handler below
});

app.listen(Number(port), "0.0.0.0", () => {
    console.log("Server listening on port", port);
});

// Catches unhandled promise rejections (e.g., forgotten catch blocks in async functions)
process.on('unhandledRejection', (err: Error) => {
    console.error('🔥 UNHANDLED REJECTION! Shutting down...');
    console.error(err.name, err.message);
    process.exit(1);
});

// Catches synchronous exceptions that weren't caught anywhere
process.on('uncaughtException', (err: Error) => {
    console.error('🔥 UNCAUGHT EXCEPTION! Shutting down...');
    console.error(err.name, err.message);
    process.exit(1);
});