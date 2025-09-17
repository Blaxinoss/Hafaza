import express, { Request, Response } from 'express';
import Attendance from '../models/Attendances.js';
import Student from '../models/students.js';
import Session from '../models/sessions.js';

/* This code snippet is defining a route in an Express router to handle adding new attendance records.
Here's a breakdown of what the code is doing: */
const router = express.Router();

// ✅ إضافة حضور جديد
router.post('/', async (req: Request, res: Response): Promise<void> => {
  try {


    const { attendances } = req.body;
    const savedAttendances = [];

    const entries = Array.isArray(attendances) ? attendances : [attendances];



    for (const entry of entries) {
      console.log(entry)
      const { studentId, sessionId, isPresent, evaluation, surahs, notes } = entry;


      if (!studentId) {
        res.status(400).json({ error: 'معرف الطالب مطلوب' });
        return
      }

      if (!sessionId) {
        res.status(400).json({ error: 'معرف الجلسة مطلوب' });
        return
      }

      const updated = await Attendance.findOneAndUpdate({ student: studentId, session: sessionId }, { isPresent, evaluation, surahs, notes }, { new: true })

      if (!updated) {
        res.status(404).json({ error: 'الحضور غير موجود لهذا الطالب في هذه الجلسة' });
        return;
      }
      savedAttendances.push(updated);
    }

    res.status(201).json(savedAttendances);

  } catch (error: any) {
    res.status(500).json({ error: 'حدث خطأ أثناء تسجيل الحضور', message: error.message });
    return
  }
});


// ✅ استعلام عن حضور طلاب لجلسة معينة
router.get('/session/:sessionId', async (req: Request, res: Response): Promise<void> => {
  try {
    const sessionId = req.params.sessionId;

    const sessionExists = await Session.findById(sessionId);
    if (!sessionExists) {
      res.status(404).json({ error: 'الجلسة غير موجودة' });
      return;
    }

    const attendances = await Attendance.find({ session: sessionId })
      .populate('student');

    res.status(200).json({
      sessionId,
      count: attendances.length,
      attendances
    });

  } catch (error) {
    res.status(500).json({ error: 'فشل في جلب بيانات الحضور' });
    return;
  }
});


router.get('/attendance/:attendanceId', async (req: Request, res: Response): Promise<void> => {
  try {
    const { attendanceId } = req.params;

    const attendance = await Attendance.findById(attendanceId)
      .populate('student')   // بيانات الطالب
      .populate('session');  // بيانات الجلسة لو محتاج

    if (!attendance) {
      res.status(404).json({ error: 'سجل الحضور غير موجود' });
      return
    }

    res.status(200).json({
      message: 'تم جلب سجل الحضور بنجاح',
      attendance
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'فشل في جلب سجل الحضور' });
  }
});

// تعديل حضور طالب في جلسة معينة
router.put('/attendance/:attendanceId', async (req: Request, res: Response): Promise<void> => {
  try {
    const attendanceId = req.params.attendanceId;
    const { isPresent, evaluation, surahs, notes } = req.body;

    const updatedAttendance = await Attendance.findByIdAndUpdate(
      attendanceId,
      { isPresent, evaluation, surahs, notes },
      { new: true }
    ).populate('student session');

    if (!updatedAttendance) {
      res.status(404).json({ error: 'سجل الحضور غير موجود' });
      return;
    }

    res.status(200).json({
      message: 'تم تحديث معلومات حضور الطالب بنجاح',
      attendance: updatedAttendance
    });

  } catch (error) {
    res.status(500).json({ error: 'فشل في تحديث الحضور' });
  }
});

router.patch('/attendance/:attendanceId', async (req: Request, res: Response): Promise<void> => {
  try {
    const attendanceId = req.params.attendanceId;
    const { isPresent } = req.body;
    const patchedAttendance = await Attendance.findByIdAndUpdate(attendanceId, {
      isPresent
    }, { new: true })

    if (!patchedAttendance) {
      res.status(404).json({ error: 'سجل الحضور الذي ترغب في تحديثه غير موجود' });
      return;
    }
    res.status(200).json({
      message: 'تم تحديث غياب الطالب بنجاح',
      attendance: patchedAttendance
    });


  } catch (error) {
    res.status(500).json({ error: 'فشل في تحديث الغياب فقط' });

  }
})


// ✅ استعلام عن حضور طالب معين
router.get('/student/:studentId', async (req: Request, res: Response): Promise<void> => {
  try {
    const studentId = req.params.studentId;
    const studentExist = await Student.findById(studentId);
    if (!studentExist) {
      res.status(404).json({ error: 'الطالب غير موجود' });
      return;
    }

    const attendances = await Attendance.find({ student: studentId })
      .populate('session', 'date');

    res.status(200).json(attendances);

  } catch (error) {
    res.status(500).json({ error: 'فشل في جلب حضور الطالب' });
    return;
  }
});

export default router;
