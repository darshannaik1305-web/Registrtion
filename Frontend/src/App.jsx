import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Registration from './components/Registration';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app-main">
        <Routes>
          <Route path="/" element={<Navigate to="/register" replace />} />
          <Route path="/register" element={<Registration />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="*" element={<Navigate to="/register" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
