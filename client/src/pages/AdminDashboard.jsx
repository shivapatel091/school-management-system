import React, { useState } from 'react';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import Overview from '../components/Overview';
import ClassesView from '../components/ClassesView';
import StudentsView from '../components/StudentsView';
import TeacherManagement from './TeacherManagement';

const AdminDashboard = () => {
    const { logout } = useContext(AuthContext);
    const [activeView, setActiveView] = useState('overview');

    const renderContent = () => {
        switch (activeView) {
            case 'overview':
                return <Overview />;
            case 'classes':
                return <ClassesView />;
            case 'students':
                return <StudentsView />;
            case 'teachers':
                return <TeacherManagement />;
            default:
                return <Overview />;
        }
    };

    return (
        <div className="dashboard-layout">
            <Sidebar activeView={activeView} setActiveView={setActiveView} logout={logout} />
            <main className="main-content">
                <div className="content-container">
                    {renderContent()}
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
