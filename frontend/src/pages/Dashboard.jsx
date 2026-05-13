import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiUsers, FiBookOpen, FiAward, FiTrendingUp } from 'react-icons/fi';
import { getStats, getStudents } from '../api';

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [recentStudents, setRecentStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, studentsRes] = await Promise.all([
        getStats(),
        getStudents(),
      ]);
      setStats(statsRes.data);
      setRecentStudents(studentsRes.data.slice(0, 5));
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCgpaClass = (cgpa) => {
    if (cgpa >= 8) return 'cgpa-high';
    if (cgpa >= 6) return 'cgpa-mid';
    return 'cgpa-low';
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="loader">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container" id="dashboard-page">
      <div className="page-header">
        <h1>Dashboard</h1>
        <p>Overview of your student record management system</p>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon purple">
            <FiUsers />
          </div>
          <div className="stat-info">
            <h3>{stats?.totalStudents || 0}</h3>
            <p>Total Students</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon green">
            <FiBookOpen />
          </div>
          <div className="stat-info">
            <h3>{stats?.departmentStats?.length || 0}</h3>
            <p>Departments</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon amber">
            <FiAward />
          </div>
          <div className="stat-info">
            <h3>
              {stats?.departmentStats?.length
                ? (
                    stats.departmentStats.reduce(
                      (acc, d) => acc + (d.avgCgpa || 0),
                      0
                    ) / stats.departmentStats.length
                  ).toFixed(1)
                : '0.0'}
            </h3>
            <p>Average CGPA</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon pink">
            <FiTrendingUp />
          </div>
          <div className="stat-info">
            <h3>{stats?.yearStats?.length || 0}</h3>
            <p>Active Years</p>
          </div>
        </div>
      </div>

      {/* Department Breakdown */}
      {stats?.departmentStats?.length > 0 && (
        <div style={{ marginBottom: '2rem' }}>
          <h2
            style={{
              fontSize: '1.1rem',
              fontWeight: 700,
              marginBottom: '1rem',
              color: 'var(--text-secondary)',
            }}
          >
            Department Breakdown
          </h2>
          <div className="stats-grid">
            {stats.departmentStats.map((dept) => (
              <div className="card" key={dept._id}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '0.5rem',
                  }}
                >
                  <span className="badge badge-department">{dept._id}</span>
                  <span
                    style={{
                      fontSize: '1.2rem',
                      fontWeight: 700,
                      color: 'var(--text-primary)',
                    }}
                  >
                    {dept.count}
                  </span>
                </div>
                <p
                  style={{
                    fontSize: '0.8rem',
                    color: 'var(--text-muted)',
                  }}
                >
                  Avg. CGPA:{' '}
                  <span className={getCgpaClass(dept.avgCgpa || 0)}>
                    {(dept.avgCgpa || 0).toFixed(2)}
                  </span>
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Students */}
      <div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1rem',
          }}
        >
          <h2
            style={{
              fontSize: '1.1rem',
              fontWeight: 700,
              color: 'var(--text-secondary)',
            }}
          >
            Recently Added Students
          </h2>
          <Link to="/students" className="btn btn-secondary btn-sm">
            View All →
          </Link>
        </div>

        {recentStudents.length > 0 ? (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Roll Number</th>
                  <th>Department</th>
                  <th>Year</th>
                  <th>CGPA</th>
                </tr>
              </thead>
              <tbody>
                {recentStudents.map((student) => (
                  <tr key={student._id}>
                    <td>
                      <Link
                        to={`/students/${student._id}`}
                        className="student-name"
                        style={{ textDecoration: 'none' }}
                      >
                        {student.name}
                      </Link>
                    </td>
                    <td>
                      <span className="student-roll">
                        {student.rollNumber}
                      </span>
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
                    <td>
                      <span
                        className={`cgpa-badge ${getCgpaClass(student.cgpa)}`}
                      >
                        {student.cgpa?.toFixed(1) || 'N/A'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="card empty-state">
            <div className="empty-icon">📚</div>
            <h3>No students yet</h3>
            <p>Start by adding your first student record.</p>
            <Link to="/students/new" className="btn btn-primary">
              Add Student
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
