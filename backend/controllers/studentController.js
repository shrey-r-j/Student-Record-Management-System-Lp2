const Student = require('../models/Student');

// @desc    Get all students (with optional search & filter)
// @route   GET /api/students
const getStudents = async (req, res) => {
  try {
    const { search, department, year } = req.query;

    let query = {};

    // Search by name or roll number
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { rollNumber: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    // Filter by department
    if (department) {
      query.department = department;
    }

    // Filter by year
    if (year) {
      query.year = Number(year);
    }

    const students = await Student.find(query).sort({ createdAt: -1 });
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single student by ID
// @route   GET /api/students/:id
const getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.json(student);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new student
// @route   POST /api/students
const createStudent = async (req, res) => {
  try {
    const { name, rollNumber, department, year, email, phone, cgpa, address } =
      req.body;

    // Check for duplicate roll number
    const existingRoll = await Student.findOne({ rollNumber });
    if (existingRoll) {
      return res
        .status(400)
        .json({ message: 'A student with this roll number already exists' });
    }

    // Check for duplicate email
    const existingEmail = await Student.findOne({ email });
    if (existingEmail) {
      return res
        .status(400)
        .json({ message: 'A student with this email already exists' });
    }

    const student = await Student.create({
      name,
      rollNumber,
      department,
      year,
      email,
      phone,
      cgpa,
      address,
    });

    res.status(201).json(student);
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a student
// @route   PUT /api/students/:id
const updateStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Check for duplicate roll number (if changing)
    if (req.body.rollNumber && req.body.rollNumber !== student.rollNumber) {
      const existingRoll = await Student.findOne({
        rollNumber: req.body.rollNumber,
      });
      if (existingRoll) {
        return res
          .status(400)
          .json({ message: 'A student with this roll number already exists' });
      }
    }

    // Check for duplicate email (if changing)
    if (req.body.email && req.body.email !== student.email) {
      const existingEmail = await Student.findOne({ email: req.body.email });
      if (existingEmail) {
        return res
          .status(400)
          .json({ message: 'A student with this email already exists' });
      }
    }

    const updatedStudent = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json(updatedStudent);
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a student
// @route   DELETE /api/students/:id
const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    await Student.findByIdAndDelete(req.params.id);
    res.json({ message: 'Student record deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get department-wise statistics
// @route   GET /api/students/stats
const getStats = async (req, res) => {
  try {
    const totalStudents = await Student.countDocuments();

    const departmentStats = await Student.aggregate([
      {
        $group: {
          _id: '$department',
          count: { $sum: 1 },
          avgCgpa: { $avg: '$cgpa' },
        },
      },
      { $sort: { count: -1 } },
    ]);

    const yearStats = await Student.aggregate([
      {
        $group: {
          _id: '$year',
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json({ totalStudents, departmentStats, yearStats });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
  getStats,
};
