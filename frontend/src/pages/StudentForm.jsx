import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { FiSave, FiArrowLeft } from 'react-icons/fi';
import { createStudent, getStudentById, updateStudent } from '../api';
import Toast from '../components/Toast';

const departments = ['Computer Science','Information Technology','Electronics','Mechanical','Civil'];

function StudentForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);
  const [formData, setFormData] = useState({ name:'', rollNumber:'', department:'', year:'', email:'', phone:'', cgpa:'', address:'' });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEditing);
  const [toast, setToast] = useState(null);

  useEffect(() => { if (isEditing) fetchStudent(); }, [id]);

  const fetchStudent = async () => {
    try {
      const res = await getStudentById(id);
      const s = res.data;
      setFormData({ name:s.name||'', rollNumber:s.rollNumber||'', department:s.department||'', year:s.year?.toString()||'', email:s.email||'', phone:s.phone||'', cgpa:s.cgpa?.toString()||'', address:s.address||'' });
    } catch { setToast({ message:'Failed to load student', type:'error' }); }
    finally { setFetching(false); }
  };

  const handleChange = (e) => { setFormData(p => ({ ...p, [e.target.name]: e.target.value })); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { ...formData, year: Number(formData.year), cgpa: formData.cgpa ? Number(formData.cgpa) : undefined };
      if (isEditing) {
        await updateStudent(id, payload);
        setToast({ message:'Updated successfully!', type:'success' });
        setTimeout(() => navigate(`/students/${id}`), 1200);
      } else {
        const res = await createStudent(payload);
        setToast({ message:'Created successfully!', type:'success' });
        setTimeout(() => navigate(`/students/${res.data._id}`), 1200);
      }
    } catch (err) { setToast({ message: err.response?.data?.message || 'Error', type:'error' }); }
    finally { setLoading(false); }
  };

  if (fetching) return <div className="page-container"><div className="loader"><div className="spinner"></div></div></div>;

  return (
    <div className="page-container" id="student-form-page">
      <div className="page-header">
        <Link to={isEditing ? `/students/${id}` : '/students'} style={{ display:'inline-flex', alignItems:'center', gap:'6px', fontSize:'0.85rem', color:'var(--text-muted)', marginBottom:'0.75rem' }}>
          <FiArrowLeft /> Back
        </Link>
        <h1>{isEditing ? 'Edit Student Record' : 'Add New Student'}</h1>
        <p>{isEditing ? 'Update the student information below' : 'Fill in the details to create a new record'}</p>
      </div>
      <form className="form-container" onSubmit={handleSubmit} id="student-form">
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="name">Full Name *</label>
            <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} placeholder="e.g. Aarav Sharma" required />
          </div>
          <div className="form-group">
            <label htmlFor="rollNumber">Roll Number *</label>
            <input type="text" id="rollNumber" name="rollNumber" value={formData.rollNumber} onChange={handleChange} placeholder="e.g. CS2024001" required />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email *</label>
            <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} placeholder="student@university.edu" required />
          </div>
          <div className="form-group">
            <label htmlFor="phone">Phone</label>
            <input type="text" id="phone" name="phone" value={formData.phone} onChange={handleChange} placeholder="9876543210" />
          </div>
          <div className="form-group">
            <label htmlFor="department">Department *</label>
            <select id="department" name="department" value={formData.department} onChange={handleChange} required>
              <option value="">Select Department</option>
              {departments.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="year">Year *</label>
            <select id="year" name="year" value={formData.year} onChange={handleChange} required>
              <option value="">Select Year</option>
              <option value="1">1st Year</option>
              <option value="2">2nd Year</option>
              <option value="3">3rd Year</option>
              <option value="4">4th Year</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="cgpa">CGPA</label>
            <input type="number" id="cgpa" name="cgpa" value={formData.cgpa} onChange={handleChange} placeholder="8.5" min="0" max="10" step="0.01" />
          </div>
          <div className="form-group">
            <label htmlFor="address">Address</label>
            <input type="text" id="address" name="address" value={formData.address} onChange={handleChange} placeholder="Pune, Maharashtra" />
          </div>
        </div>
        <div className="form-actions">
          <Link to={isEditing ? `/students/${id}` : '/students'} className="btn btn-secondary">Cancel</Link>
          <button type="submit" className="btn btn-primary" disabled={loading} id="submit-btn">
            <FiSave /> {loading ? 'Saving...' : isEditing ? 'Update Record' : 'Create Record'}
          </button>
        </div>
      </form>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}

export default StudentForm;
