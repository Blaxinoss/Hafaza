import express from 'express';
import Session from '../models/sessions.js';
import Student from '../models/students.js';
import Attendance from '../models/Attendances.js';

const router = express.Router();

// POST /api/sessions
router.post('/', async (req, res) => {
  try {
    const { date } = req.body;

    const session = new Session({ date });
    await session.save();

       const students = await Student.find({});

         const attendances = students.map(student => ({
      student: student._id,
      session: session._id,
      isPresent: false,  
      evaluation: null,
      surahs:[],
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
    const studentCurrentCount = await Student.countDocuments();
    const sessions = await Session.aggregate([
      {
        $lookup: {
          from: "attendances", // لازم يكون نفس اسم الكولكشن في MongoDB (غالبًا lowercase وجمع)
          localField: "_id",
          foreignField: "session",
          as: "attendances",
        },
      },
      {
        $addFields: {
          presentStudents: {
            $filter: {
              input: "$attendances",
              as: "att",
              cond: { $eq: ["$$att.isPresent", true] },
            },
          },
        },
      },
      {
        $project: {
          attendances: 0, // إخفاء الحقول غير المهمة لو عايز
        },
      },
    ]);

    res.json({sessions,studentCurrentCount});
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching sessions" });
  }
});

export default router;
