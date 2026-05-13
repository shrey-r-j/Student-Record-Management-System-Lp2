import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import StudentList from './pages/StudentList';
import StudentForm from './pages/StudentForm';
import StudentDetail from './pages/StudentDetail';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/students" element={<StudentList />} />
        <Route path="/students/new" element={<StudentForm />} />
        <Route path="/students/:id" element={<StudentDetail />} />
        <Route path="/students/:id/edit" element={<StudentForm />} />
      </Routes>
    </Router>
  );
}

export default App;
