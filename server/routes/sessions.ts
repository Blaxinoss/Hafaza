import express from 'express';
import Session from '../models/sessions';
import Student from '../models/students';
import Attendance from '../models/Attendances';

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
    const sessions = await Session.find();
    if(!sessions || sessions.length === 0) {
      res.status(404).json({ message: "No sessions found" });
      return;
    }
    
    res.json(sessions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching sessions" });
  }
});

export default router;
