import express, { Request, Response } from 'express';
import mongoose from 'mongoose';

import Teacher, { ITeacher } from '../models/teachers.js';

const router = express.Router();

// استخدم express.Request و express.Response مباشرة
router.get('/', async (req: Request, res: Response) :Promise<void>=> {
    try {
        const teachers = await Teacher.find();
        res.status(200).json(teachers);
        return;
    } catch (error) {
        res.status(500).json({ message: "حدث خطأ أثناء جلب المعلمين", error });
    }
});

router.post('/', async (req: Request, res: Response):Promise<void> => {
    try {
        const teacherData: ITeacher = req.body;
        const newTeacher = new Teacher(teacherData);
        await newTeacher.save();
        res.status(201).json(newTeacher);
        return;
    } catch (error) {
        res.status(500).json({ message: "حدث خطأ أثناء إدخال المعلم", error });
    }
});

router.delete('/:id', async (req: Request, res: Response):Promise<void> => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            res.status(400).json({ message: "لا يوجد معلم برقم المعرف هذا" });
            return;
        }
        const teacherToDelete = await Teacher.findByIdAndDelete(id);
        if (teacherToDelete) {
            res.status(200).json({ message: "تم مسح المعلم بنجاح" });
            return;
        } else {
            throw new Error("لا يوجد معلم بهذه البيانات");
        }
    } catch (error) {
        res.status(500).json({ message: "حدث خطأ أثناء مسح هذا المعلم" ,error});
    }
});

router.put('/:id', async (req: Request, res: Response) :Promise<void>=> {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            res.status(400).json({ message: "لا يوجد معلم برقم المعرف هذا" });
            return;
        }

        const updatedTeacher = await Teacher.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedTeacher) {
          res.status(404).json({ message: "المعلم غير موجود" });
          return;
        }
        res.status(200).json(updatedTeacher);
    } catch (error) {
        res.status(500).json({ message: "حدث خطأ أثناء تحديث بيانات المعلم", error });
    }
});

export default router;
