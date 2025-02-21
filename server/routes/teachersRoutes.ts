import express from 'express';
import mongoose from 'mongoose';
import Teacher, { ITeacher } from '../models/teachers';

const router = express.Router();

// استخدم express.Request و express.Response مباشرة
router.get('/', async (req: express.Request, res: express.Response) => {
    try {
        const teachers = await Teacher.find();
        res.status(200).json(teachers);
    } catch (error) {
        res.status(500).json({ message: "حدث خطأ أثناء جلب المعلمين", error });
    }
});

router.post('/', async (req: express.Request, res: express.Response) => {
    try {
        const teacherData: ITeacher = req.body;
        const newTeacher = new Teacher(teacherData);
        await newTeacher.save();
        res.status(201).json(newTeacher);
    } catch (error) {
        res.status(500).json({ message: "حدث خطأ أثناء إدخال المعلم", error });
    }
});

router.delete('/:id', async (req: express.Request, res: express.Response) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "لا يوجد معلم برقم المعرف هذا" });
        }
        const teacherToDelete = await Teacher.findByIdAndDelete(id);
        if (teacherToDelete) {
            res.status(200).json({ message: "تم مسح المعلم بنجاح" });
        } else {
            throw new Error("لا يوجد معلم بهذه البيانات");
        }
    } catch (error) {
        res.status(500).json({ message: "حدث خطأ أثناء مسح هذا المعلم" });
    }
});

router.put('/:id', async (req: express.Request, res: express.Response) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "لا يوجد معلم برقم المعرف هذا" });
        }

        const updatedTeacher = await Teacher.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedTeacher) {
            return res.status(404).json({ message: "المعلم غير موجود" });
        }
        res.status(200).json(updatedTeacher);
    } catch (error) {
        res.status(500).json({ message: "حدث خطأ أثناء تحديث بيانات المعلم", error });
    }
});

export default router;
