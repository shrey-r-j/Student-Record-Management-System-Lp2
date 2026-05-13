import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiEdit2, FiTrash2, FiMail, FiPhone, FiMapPin } from 'react-icons/fi';
import { getStudentById, deleteStudent } from '../api';
import ConfirmModal from '../components/ConfirmModal';
import Toast from '../components/Toast';

function StudentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDelete, setShowDelete] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => { fetchStudent(); }, [id]);

  const fetchStudent = async () => {
    try {
      const res = await getStudentById(id);
      setStudent(res.data);
    } catch { setToast({ message:'Student not found', type:'error' }); }
    finally { setLoading(false); }
  };

  const handleDelete = async () => {
    try {
      await deleteStudent(id);
      setToast({ message:'Deleted successfully', type:'success' });
      setTimeout(() => navigate('/students'), 1200);
    } catch { setToast({ message:'Delete failed', type:'error' }); }
    setShowDelete(false);
  };

  const getCgpaClass = (c) => c >= 8 ? 'cgpa-high' : c >= 6 ? 'cgpa-mid' : 'cgpa-low';

  if (loading) return <div className="page-container"><div className="loader"><div className="spinner"></div></div></div>;
  if (!student) return <div className="page-container"><div className="card empty-state"><h3>Student not found</h3><Link to="/students" className="btn btn-primary">Back to Students</Link></div></div>;

  return (
    <div className="page-container" id="student-detail-page">
      <div className="page-header">
        <Link to="/students" style={{ display:'inline-flex', alignItems:'center', gap:'6px', fontSize:'0.85rem', color:'var(--text-muted)', marginBottom:'0.75rem' }}>
          <FiArrowLeft /> Back to Students
        </Link>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:'1rem' }}>
          <div>
            <h1>{student.name}</h1>
            <p><span className="student-roll">{student.rollNumber}</span></p>
          </div>
          <div style={{ display:'flex', gap:'0.5rem' }}>
            <Link to={`/students/${id}/edit`} className="btn btn-success"><FiEdit2 /> Edit</Link>
            <button className="btn btn-danger" onClick={() => setShowDelete(true)}><FiTrash2 /> Delete</button>
          </div>
        </div>
      </div>

      <div className="detail-grid">
        <div className="detail-card">
          <h3>Academic Information</h3>
          <div className="detail-row"><span className="detail-label">Department</span><span className="badge badge-department">{student.department}</span></div>
          <div className="detail-row"><span className="detail-label">Year</span><span className="badge badge-year">Year {student.year}</span></div>
          <div className="detail-row"><span className="detail-label">CGPA</span><span className={`cgpa-badge ${getCgpaClass(student.cgpa||0)}`}>{student.cgpa?.toFixed(2) || 'N/A'}</span></div>
        </div>
        <div className="detail-card">
          <h3>Contact Information</h3>
          <div className="detail-row"><span className="detail-label"><FiMail style={{marginRight:6}}/>Email</span><span className="detail-value">{student.email}</span></div>
          <div className="detail-row"><span className="detail-label"><FiPhone style={{marginRight:6}}/>Phone</span><span className="detail-value">{student.phone || 'Not provided'}</span></div>
          <div className="detail-row"><span className="detail-label"><FiMapPin style={{marginRight:6}}/>Address</span><span className="detail-value">{student.address || 'Not provided'}</span></div>
        </div>
        <div className="detail-card">
          <h3>Record Metadata</h3>
          <div className="detail-row"><span className="detail-label">Created</span><span className="detail-value">{new Date(student.createdAt).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })}</span></div>
          <div className="detail-row"><span className="detail-label">Last Updated</span><span className="detail-value">{new Date(student.updatedAt).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })}</span></div>
        </div>
      </div>

      {showDelete && <ConfirmModal title="Delete Student" message={`Delete ${student.name}'s record? This cannot be undone.`} onConfirm={handleDelete} onCancel={() => setShowDelete(false)} />}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}

export default StudentDetail;
