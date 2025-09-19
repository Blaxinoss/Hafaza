import express from 'express'
import type { Request, Response } from 'express';
import mongoose from 'mongoose';
import Student from '../models/students';
import type { IStudent } from '../models/students' // تأكد من أن لديك موديل الطلاب

const router = express.Router();

router.get('/', async (req: Request, res: Response): Promise<void> => {
    try {
        const students = await Student.find();
        res.status(200).json(students);
    } catch (error) {
        res.status(500).json({ message: "حدث خطأ أثناء جلب الطلاب", error });
    }
});

router.post('/', async (req: Request, res: Response): Promise<void> => {
    try {
        const studentData: IStudent = req.body;
        const newStudent = new Student(studentData);
        await newStudent.save();
        res.status(201).json(newStudent);
    } catch (error) {
        res.status(500).json({ message: "حدث خطأ أثناء إضافة الطالب", error });
    }
});

router.put('/:id', async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        if (!id) {
            res.status(400).json({ message: "لا يوجد رقم معرف متاح بهذا الشكل" });
            return;
        }
        if (!mongoose.Types.ObjectId.isValid(id)) {
            res.status(400).json({ message: "لا يوجد طالب برقم المعرف هذا" });
            return;
        }
        const updatedStudent = await Student.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedStudent) {
            res.status(404).json({ message: "الطالب غير موجود" });
            return;
        }
        res.status(200).json(updatedStudent);
    } catch (error) {
        res.status(500).json({ message: "حدث خطأ أثناء تحديث بيانات الطالب", error });
    }
});

router.delete('/:id', async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        if (!id) {
            res.status(400).json({ message: "لا يوجد رقم معرف متاح بهذا الشكل" });
            return;
        }
        if (!mongoose.Types.ObjectId.isValid(id)) {
            res.status(400).json({ message: "لا يوجد طالب برقم المعرف هذا" });
            return;
        }
        const studentToDelete = await Student.findByIdAndDelete(id);
        if (studentToDelete) {
            res.status(200).json({ message: "تم حذف الطالب بنجاح" });
        } else {
            res.status(404).json({ message: "لا يوجد طالب بهذه البيانات" });
            return;
        }
    } catch (error) {
        res.status(500).json({ message: "حدث خطأ أثناء حذف الطالب", error });
    }
});

export default router;
