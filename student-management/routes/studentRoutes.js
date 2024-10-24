const express = require('express');
const studentController = require('../controllers/studentController');
const router = express.Router();

router.get('/login', studentController.loginPage);
router.post('/login', studentController.login);
router.get('/logout', studentController.logout);

router.get('/students', studentController.getAllStudents);
router.get('/students/add', studentController.addStudentPage);
router.post('/students/add', studentController.addStudent);
router.get('/students/edit/:id', studentController.editStudentPage);
router.post('/students/edit/:id', studentController.editStudent);
router.get('/students/delete/:id', studentController.deleteStudent);

module.exports = router;
