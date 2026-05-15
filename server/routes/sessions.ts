import express from 'express';
import mongoose from 'mongoose';
import Session from '../models/sessions.js';
import Student from '../models/students.js';
import Teacher from '../models/teachers.js';
import Attendance from '../models/Attendances.js';

const router = express.Router();

// POST /api/sessions
router.post('/', async (req, res) => {
  try {
    const { date, teacherId } = req.body;

    const session = new Session({ date });
    await session.save();

    const students = await Student.find({});

    const selectedTeacher = teacherId
      ? await Teacher.findById(teacherId)
      : await Teacher.findOne().sort({ createdAt: -1 });

    if (!selectedTeacher) {
      res.status(400).json({ message: 'لا يوجد معلم متاح. أضف معلمًا أولًا.' });
      return;
    }

    const attendances = students.map(student => ({
      student: student._id,
      teacher: selectedTeacher._id,
      session: session._id,
      isPresent: false,
      evaluation: null,
      surahs: [],
    }));

    await Attendance.insertMany(attendances);


    res.status(201).json({ session, attendancesCreated: attendances.length });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error saving session and attendances" });
  }
});

// GET /api/sessions
router.get('/', async (req, res) => {
  try {
    // عدد كل الطلاب
    const studentCurrentCount = await Student.countDocuments();

    // جلب كل الجلسات
    const sessions = await Session.find().sort({ date: -1 });

    // حساب عدد الحاضرين لكل جلسة
    const sessionsWithCounts = await Promise.all(
      sessions.map(async (session) => {
        const presentCount = await Attendance.countDocuments({ session: session._id, isPresent: true });
        return {
          _id: session._id,
          date: session.date,
          presentCount,
        };
      })
    );

    res.json({ sessions: sessionsWithCounts, studentCurrentCount });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching sessions', error: err.message });
  }
});

// DELETE /api/sessions/:id - delete a session and its attendances
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({ message: 'لا يوجد رقم معرف متاح بهذا الشكل' });
      return;
    }
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: 'لا يوجد جلسة برقم المعرف هذا' });
      return;
    }

    const sessionToDelete = await Session.findByIdAndDelete(id);
    if (!sessionToDelete) {
      res.status(404).json({ message: 'الجلسة غير موجودة' });
      return;
    }

    // remove related attendances
    await Attendance.deleteMany({ session: id });

    res.status(200).json({ message: 'تم حذف الجلسة وحضورياتها بنجاح' });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: 'حدث خطأ أثناء حذف الجلسة', error: err.message });
  }
});

export default router;

