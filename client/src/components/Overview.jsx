import React, { useState, useEffect } from 'react';
import axios from 'axios';
import authHeader from '../services/auth-header';

const Overview = () => {
    const [stats, setStats] = useState(null);
    const [defaultedFees, setDefaultedFees] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:3000/api/dashboard/stats', { headers: authHeader() })
            .then(response => setStats(response.data))
            .catch(error => console.error(error));

        axios.get('http://localhost:3000/api/dashboard/defaulted', { headers: authHeader() })
            .then(response => setDefaultedFees(response.data))
            .catch(error => console.error(error));
    }, []);

    if (!stats) return <div>Loading stats...</div>;

    return (
        <div className="overview-container">
            <h2>Dashboard Overview</h2>
            <div className="stats-grid">
                <div className="stat-card total-students">
                    <h3>Total Students</h3>
                    <p>{stats.totalStudents}</p>
                </div>
                <div className="stat-card defaulted-amount">
                    <h3>Defaulted Amount</h3>
                    <p className="text-danger">${defaultedFees.reduce((sum, s) => sum + s.amount, 0)}</p>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                <div className="card">
                    <h3>Class Statistics</h3>
                    <div className="class-stats-table">
                        <table>
                            <thead>
                                <tr>
                                    <th>Class</th>
                                    <th>Students</th>
                                    <th>Remaining</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stats.classStats.map((cls, index) => (
                                    <tr key={index}>
                                        <td>{cls.name}</td>
                                        <td>{cls.studentCount}</td>
                                        <td className={cls.remainingFee > 0 ? 'text-danger' : 'text-success'}>
                                            ${cls.remainingFee}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="card">
                    <h3>Defaulted Fees Report</h3>
                    {defaultedFees.length > 0 ? (
                        <table>
                            <thead>
                                <tr>
                                    <th>Student</th>
                                    <th>Class</th>
                                    <th>Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {defaultedFees.map(student => (
                                    <tr key={student.id}>
                                        <td>{student.name} ({student.roll_number})</td>
                                        <td>{student.class}</td>
                                        <td className="text-danger">${student.amount}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p>No defaulted fees.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Overview;
