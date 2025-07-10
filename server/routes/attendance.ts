import express, { Request, Response } from 'express';
import Attendance from '../models/Attendances';
import Student from '../models/students';
import Session from '../models/sessions';

const router = express.Router();

// ✅ إضافة حضور جديد
router.post('/', async (req: Request, res: Response): Promise<void> => {
  try {


   const {attendances} = req.body;
       const savedAttendances = [];

   const entries = Array.isArray(attendances) ? attendances : [attendances];

   for(const entry of entries){
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

    const student = await Student.findById(studentId);
    if (!student) {
       res.status(404).json({ error: 'الطالب غير موجود' });
       return
    }

    const session = await Session.findById(sessionId);
    if (!session) {
       res.status(404).json({ error: 'الجلسة غير موجودة' });
       return
    }

    const attendance = new Attendance({
      student: studentId,
      session: sessionId,
      isPresent,
      evaluation,
      surahs,
      notes,
    });

    const saved = await attendance.save();
 savedAttendances.push(saved);
     }
           res.status(201).json(savedAttendances);

  } catch (error : any) {
     res.status(500).json({ error: 'حدث خطأ أثناء تسجيل الحضور' , message : error.message});
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
      .populate('student')
      .populate('session', 'date');

     res.status(200).json(attendances);
  } catch (error) {
     res.status(500).json({ error: 'فشل في جلب بيانات الحضور' });
     return;
  }
});

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
