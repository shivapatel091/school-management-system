import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Sidebar = ({ activeView, setActiveView, logout }) => {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(true);

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    return (
        <>
            <button className="sidebar-toggle" onClick={toggleSidebar}>
                {isOpen ? '✕' : '☰'}
            </button>
            <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
                <div className="sidebar-header">
                    <h3>{isOpen ? 'School Admin' : 'SA'}</h3>
                </div>
                <ul className="sidebar-menu">
                    <li className={activeView === 'overview' ? 'active' : ''} onClick={() => setActiveView('overview')}>
                        <span className="icon">📊</span>
                        {isOpen && <span className="label">Overview</span>}
                    </li>
                    <li className={activeView === 'classes' ? 'active' : ''} onClick={() => setActiveView('classes')}>
                        <span className="icon">🏫</span>
                        {isOpen && <span className="label">Classes</span>}
                    </li>
                    <li className={activeView === 'students' ? 'active' : ''} onClick={() => setActiveView('students')}>
                        <span className="icon">🎓</span>
                        {isOpen && <span className="label">Students</span>}
                    </li>
                    <li className={activeView === 'teachers' ? 'active' : ''} onClick={() => setActiveView('teachers')}>
                        <span className="icon">👨‍🏫</span>
                        {isOpen && <span className="label">Teachers</span>}
                    </li>
                </ul>
                <div className="sidebar-footer">
                    <button onClick={logout} className="logout-btn">
                        {isOpen ? 'Logout' : '⏻'}
                    </button>
                </div>
            </div>
        </>
    );
};

export default Sidebar;
