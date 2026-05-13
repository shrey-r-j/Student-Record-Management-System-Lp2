const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Student = require('./models/Student');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const sampleStudents = [
  {
    name: 'Aarav Sharma',
    rollNumber: 'CS2024001',
    department: 'Computer Science',
    year: 2,
    email: 'aarav.sharma@university.edu',
    phone: '9876543210',
    cgpa: 8.7,
    address: 'Pune, Maharashtra',
  },
  {
    name: 'Priya Patel',
    rollNumber: 'IT2024002',
    department: 'Information Technology',
    year: 3,
    email: 'priya.patel@university.edu',
    phone: '9876543211',
    cgpa: 9.1,
    address: 'Mumbai, Maharashtra',
  },
  {
    name: 'Rohan Deshmukh',
    rollNumber: 'EC2024003',
    department: 'Electronics',
    year: 1,
    email: 'rohan.d@university.edu',
    phone: '9876543212',
    cgpa: 7.8,
    address: 'Nagpur, Maharashtra',
  },
  {
    name: 'Sneha Kulkarni',
    rollNumber: 'ME2024004',
    department: 'Mechanical',
    year: 4,
    email: 'sneha.k@university.edu',
    phone: '9876543213',
    cgpa: 8.3,
    address: 'Nashik, Maharashtra',
  },
  {
    name: 'Vikram Singh',
    rollNumber: 'CS2024005',
    department: 'Computer Science',
    year: 3,
    email: 'vikram.s@university.edu',
    phone: '9876543214',
    cgpa: 7.5,
    address: 'Delhi, India',
  },
  {
    name: 'Ananya Joshi',
    rollNumber: 'IT2024006',
    department: 'Information Technology',
    year: 2,
    email: 'ananya.j@university.edu',
    phone: '9876543215',
    cgpa: 9.4,
    address: 'Bangalore, Karnataka',
  },
  {
    name: 'Karan Mehta',
    rollNumber: 'EC2024007',
    department: 'Electronics',
    year: 1,
    email: 'karan.m@university.edu',
    phone: '9876543216',
    cgpa: 6.9,
    address: 'Hyderabad, Telangana',
  },
  {
    name: 'Disha Gupta',
    rollNumber: 'CE2024008',
    department: 'Civil',
    year: 2,
    email: 'disha.g@university.edu',
    phone: '9876543217',
    cgpa: 8.1,
    address: 'Chennai, Tamil Nadu',
  },
  {
    name: 'Arjun Reddy',
    rollNumber: 'CS2024009',
    department: 'Computer Science',
    year: 4,
    email: 'arjun.r@university.edu',
    phone: '9876543218',
    cgpa: 8.9,
    address: 'Pune, Maharashtra',
  },
  {
    name: 'Meera Nair',
    rollNumber: 'ME2024010',
    department: 'Mechanical',
    year: 3,
    email: 'meera.n@university.edu',
    phone: '9876543219',
    cgpa: 7.2,
    address: 'Kochi, Kerala',
  },
];

const seedDB = async () => {
  try {
    await Student.deleteMany();
    console.log('🗑️  Cleared existing student records');

    const created = await Student.insertMany(sampleStudents);
    console.log(`✅ Seeded ${created.length} student records`);

    process.exit(0);
  } catch (error) {
    console.error(`❌ Seeding Error: ${error.message}`);
    process.exit(1);
  }
};

seedDB();
