const Student = require('../models/studentModel');
const bcrypt = require('bcryptjs');

exports.loginPage = (req, res) => {
  res.render('login');
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const student = await Student.findOne({ email });
  if (student && await bcrypt.compare(password, student.password)) {
    req.session.studentId = student._id;
    return res.redirect('/students');
  } else {
    return res.render('login', { error: 'Invalid credentials' });
  }
};

exports.logout = (req, res) => {
  req.session.destroy();
  res.redirect('/login');
};

exports.getAllStudents = async (req, res) => {
  if (!req.session.studentId) return res.redirect('/login');
  const students = await Student.find();
  res.render('students', { students });
};

exports.addStudentPage = (req, res) => {
  res.render('add-student');
};

exports.addStudent = async (req, res) => {
  const { name, email, password, course } = req.body;
  await Student.create({ name, email, password, course });
  res.redirect('/students');
};

exports.editStudentPage = async (req, res) => {
  const student = await Student.findById(req.params.id);
  res.render('edit-student', { student });
};

exports.editStudent = async (req, res) => {
  const { name, email, course } = req.body;
  await Student.findByIdAndUpdate(req.params.id, { name, email, course });
  res.redirect('/students');
};

exports.deleteStudent = async (req, res) => {
  await Student.findByIdAndDelete(req.params.id);
  res.redirect('/students');
};
