const express = require('express');
const router = express.Router();
const {
  getStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
  getStats,
} = require('../controllers/studentController');

// Stats route must come before /:id to avoid conflicts
router.get('/stats', getStats);

router.route('/').get(getStudents).post(createStudent);
router.route('/:id').get(getStudentById).put(updateStudent).delete(deleteStudent);

module.exports = router;
