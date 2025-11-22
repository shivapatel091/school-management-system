import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import AdminDashboard from './AdminDashboard';
import TeacherDashboard from './TeacherDashboard';

const Dashboard = () => {
    const { currentUser, logout } = useContext(AuthContext);

    if (!currentUser) return <Navigate to="/login" />;

    if (currentUser.role === 'admin') {
        return <AdminDashboard />;
    }

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <h1>School Management System</h1>
                <div className="user-info">
                    <span>Welcome, {currentUser.username} ({currentUser.role})</span>
                    <button onClick={logout} className="logout-btn">Logout</button>
                </div>
            </header>
            <main className="dashboard-content">
                <TeacherDashboard />
            </main>
        </div>
    );
};

export default Dashboard;
