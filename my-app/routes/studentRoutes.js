const express = require('express');
const Student = require('../models/Student');
const jwt = require('jsonwebtoken');
const router = express.Router();

function verifyToken(req, res, next) {
  const token = req.headers['authorization'];
  if (!token) return res.status(403).json({ error: 'No token provided' });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(500).json({ error: 'Failed to authenticate token' });
    req.userId = decoded.userId;
    next();
  });
}

router.post('/create', verifyToken, async (req, res) => {
  const { name, email, age, department } = req.body;
  try {
    const student = new Student({ name, email, age, department });
    await student.save();
    res.json(student);
  } catch (error) {
    res.status(500).json({ error: 'Error creating student' });
  }
});

router.get('/list', verifyToken, async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching students' });
  }
});

router.put('/update/:id', verifyToken, async (req, res) => {
  const { name, email, age, department } = req.body;
  try {
    const student = await Student.findByIdAndUpdate(req.params.id, { name, email, age, department }, { new: true });
    res.json(student);
  } catch (error) {
    res.status(500).json({ error: 'Error updating student' });
  }
});

router.delete('/delete/:id', verifyToken, async (req, res) => {
  try {
    await Student.findByIdAndDelete(req.params.id);
    res.json({ message: 'Student deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting student' });
  }
});

module.exports = router;
