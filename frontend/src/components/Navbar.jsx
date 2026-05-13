import { Link, useLocation } from 'react-router-dom';
import { FiHome, FiUsers, FiUserPlus } from 'react-icons/fi';

function Navbar() {
  const location = useLocation();

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="navbar" id="main-navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand">
          <div className="brand-icon">🎓</div>
          <span>StudentDB</span>
        </Link>

        <div className="navbar-links">
          <Link
            to="/"
            className={`nav-link ${isActive('/') && location.pathname === '/' ? 'active' : ''}`}
            id="nav-dashboard"
          >
            <FiHome />
            <span>Dashboard</span>
          </Link>
          <Link
            to="/students"
            className={`nav-link ${isActive('/students') && !location.pathname.includes('/new') ? 'active' : ''}`}
            id="nav-students"
          >
            <FiUsers />
            <span>Students</span>
          </Link>
          <Link
            to="/students/new"
            className={`nav-link ${location.pathname === '/students/new' ? 'active' : ''}`}
            id="nav-add-student"
          >
            <FiUserPlus />
            <span>Add Student</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
