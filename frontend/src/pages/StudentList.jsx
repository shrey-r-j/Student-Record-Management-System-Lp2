import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FiSearch,
  FiEdit2,
  FiTrash2,
  FiEye,
  FiPlus,
} from 'react-icons/fi';
import { getStudents, deleteStudent } from '../api';
import ConfirmModal from '../components/ConfirmModal';
import Toast from '../components/Toast';

function StudentList() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('');
  const [year, setYear] = useState('');
  const [deleteId, setDeleteId] = useState(null);
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();

  const departments = [
    'Computer Science',
    'Information Technology',
    'Electronics',
    'Mechanical',
    'Civil',
  ];

  useEffect(() => {
    fetchStudents();
  }, [search, department, year]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search) params.search = search;
      if (department) params.department = department;
      if (year) params.year = year;

      const res = await getStudents(params);
      setStudents(res.data);
    } catch (error) {
      console.error('Failed to fetch students:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteStudent(deleteId);
      setStudents((prev) => prev.filter((s) => s._id !== deleteId));
      setDeleteId(null);
      setToast({ message: 'Student record deleted successfully', type: 'success' });
    } catch (error) {
      setToast({
        message: error.response?.data?.message || 'Failed to delete',
        type: 'error',
      });
      setDeleteId(null);
    }
  };

  const getCgpaClass = (cgpa) => {
    if (cgpa >= 8) return 'cgpa-high';
    if (cgpa >= 6) return 'cgpa-mid';
    return 'cgpa-low';
  };

  return (
    <div className="page-container" id="student-list-page">
      <div className="page-header">
        <h1>Student Records</h1>
        <p>Browse, search, and manage all student records</p>
      </div>

      {/* Toolbar */}
      <div className="toolbar">
        <div className="toolbar-left">
          <div className="search-box">
            <FiSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search by name, roll number, or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              id="search-input"
            />
          </div>

          <select
            className="filter-select"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            id="department-filter"
          >
            <option value="">All Departments</option>
            {departments.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>

          <select
            className="filter-select"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            id="year-filter"
            style={{ minWidth: '120px' }}
          >
            <option value="">All Years</option>
            <option value="1">Year 1</option>
            <option value="2">Year 2</option>
            <option value="3">Year 3</option>
            <option value="4">Year 4</option>
          </select>
        </div>

        <Link to="/students/new" className="btn btn-primary" id="add-student-btn">
          <FiPlus />
          Add Student
        </Link>
      </div>

      {/* Table */}
      {loading ? (
        <div className="loader">
          <div className="spinner"></div>
        </div>
      ) : students.length > 0 ? (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Roll Number</th>
                <th>Department</th>
                <th>Year</th>
                <th>Email</th>
                <th>CGPA</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student._id}>
                  <td>
                    <span className="student-name">{student.name}</span>
                  </td>
                  <td>
                    <span className="student-roll">{student.rollNumber}</span>
                  </td>
                  <td>
                    <span className="badge badge-department">
                      {student.department}
                    </span>
                  </td>
                  <td>
                    <span className="badge badge-year">
                      Year {student.year}
                    </span>
                  </td>
                  <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    {student.email}
                  </td>
                  <td>
                    <span className={`cgpa-badge ${getCgpaClass(student.cgpa)}`}>
                      {student.cgpa?.toFixed(1) || 'N/A'}
                    </span>
                  </td>
                  <td>
                    <div className="actions-cell">
                      <button
                        className="btn btn-icon btn-secondary"
                        title="View Details"
                        onClick={() => navigate(`/students/${student._id}`)}
                      >
                        <FiEye />
                      </button>
                      <button
                        className="btn btn-icon btn-success"
                        title="Edit"
                        onClick={() =>
                          navigate(`/students/${student._id}/edit`)
                        }
                      >
                        <FiEdit2 />
                      </button>
                      <button
                        className="btn btn-icon btn-danger"
                        title="Delete"
                        onClick={() => setDeleteId(student._id)}
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="card empty-state">
          <div className="empty-icon">🔍</div>
          <h3>No students found</h3>
          <p>
            {search || department || year
              ? 'Try adjusting your search or filters.'
              : 'Add your first student to get started.'}
          </p>
          {!search && !department && !year && (
            <Link to="/students/new" className="btn btn-primary">
              <FiPlus /> Add Student
            </Link>
          )}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <ConfirmModal
          title="Delete Student Record"
          message="Are you sure you want to delete this student record? This action cannot be undone."
          onConfirm={handleDelete}
          onCancel={() => setDeleteId(null)}
        />
      )}

      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}

export default StudentList;
