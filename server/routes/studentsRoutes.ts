import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import Student, { IStudent } from '../models/students'; // تأكد من أن لديك موديل الطلاب

const router = express.Router();

router.get('/', async (req: Request, res: Response) => {
    try {
        const students = await Student.find();
        res.status(200).json(students);
    } catch (error) {
        res.status(500).json({ message: "حدث خطأ أثناء جلب الطلاب", error });
    }
});

router.post('/', async (req: Request, res: Response) => {
    try {
        const studentData: IStudent = req.body;
        const newStudent = new Student(studentData);
        await newStudent.save();
        res.status(201).json(newStudent);
    } catch (error) {
        res.status(500).json({ message: "حدث خطأ أثناء إضافة الطالب", error });
    }
});

router.put('/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "لا يوجد طالب برقم المعرف هذا" });
        }
        const updatedStudent = await Student.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedStudent) {
            return res.status(404).json({ message: "الطالب غير موجود" });
        }
        res.status(200).json(updatedStudent);
    } catch (error) {
        res.status(500).json({ message: "حدث خطأ أثناء تحديث بيانات الطالب", error });
    }
});

router.delete('/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "لا يوجد طالب برقم المعرف هذا" });
        }
        const studentToDelete = await Student.findByIdAndDelete(id);
        if (studentToDelete) {
            res.status(200).json({ message: "تم حذف الطالب بنجاح" });
        } else {
            return res.status(404).json({ message: "لا يوجد طالب بهذه البيانات" });
        }
    } catch (error) {
        res.status(500).json({ message: "حدث خطأ أثناء حذف الطالب", error });
    }
});

export default router;
