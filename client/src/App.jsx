import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import FeeManagement from './pages/FeeManagement';
import GradeManagement from './pages/GradeManagement';
import ClassDashboard from './pages/ClassDashboard';
import './index.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/fees/:studentId" element={<FeeManagement />} />
          <Route path="/grades/:studentId" element={<GradeManagement />} />
          <Route path="/classes" element={<ClassDashboard />} />
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
