import cors from 'cors';
import dotenv from 'dotenv';
import express, { Application, Request, Response } from 'express';
import mongoose from 'mongoose';
import studentsRoute from './routes/studentsRoutes';
import teachersRoute from './routes/teachersRoutes';

// تحميل متغيرات البيئة
dotenv.config();

const app: Application = express();
app.use(express.json())
app.use(cors());

const port: string | number = process.env.PORT || 5000;

// الاتصال بقاعدة البيانات
mongoose.connect(process.env.MONGO_URI as string)
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.log(err));

app.get('/', (req: Request, res: Response) => {
    res.send("Hello, World!");
});

app.use('/api/teachers', teachersRoute);
app.use('/api/students', studentsRoute);

app.listen(port, () => {
    console.log("Server listening on port", port);
});
