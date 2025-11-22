import React, { useState, useEffect } from 'react';
import axios from 'axios';
import authHeader from '../services/auth-header';
import { useNavigate } from 'react-router-dom';

const ClassesView = () => {
    const [stats, setStats] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get('http://localhost:3000/api/dashboard/stats', { headers: authHeader() })
            .then(response => {
                if (response.data && response.data.classStats) {
                    setStats(response.data.classStats);
                } else {
                    setStats([]);
                }
            })
            .catch(error => console.error(error));
    }, []);

    return (
        <div className="classes-view">
            <h2>Classes</h2>
            <div className="cards-grid">
                {stats.map((cls, index) => (
                    <div key={index} className="class-card" onClick={() => navigate(`/classes`)}>
                        {/* Navigating to existing ClassDashboard for details for now, or could open modal */}
                        <h3>Class {cls.name}</h3>
                        <p>Students: {cls.studentCount}</p>
                        <p>Fee Due: ${cls.remainingFee}</p>
                        <button className="view-btn">View Details</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ClassesView;
