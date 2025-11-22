import React, { useState, useEffect } from 'react';
import axios from 'axios';
import authHeader from '../services/auth-header';

const TeacherDashboard = () => {
    const [assignedClasses, setAssignedClasses] = useState([]);
    const [selectedClass, setSelectedClass] = useState(null);
    const [classStudents, setClassStudents] = useState([]);
    const [schedule, setSchedule] = useState([]);
    const [students, setStudents] = useState([]);

    useEffect(() => {
        // Fetch assigned classes
        axios.get('http://localhost:3000/api/teacher-assignments/my-classes', { headers: authHeader() })
            .then(response => {
                setAssignedClasses(response.data);
            })
            .catch(error => console.error('Error fetching classes:', error));

        // Fetch today's schedule
        axios.get('http://localhost:3000/api/schedules/today', { headers: authHeader() })
            .then(response => {
                setSchedule(response.data);
            })
            .catch(error => console.error('Error fetching schedule:', error));

        // Fetch all students (to filter by assigned classes)
        axios.get('http://localhost:3000/api/students', { headers: authHeader() })
            .then(response => {
                setStudents(response.data);
            })
            .catch(error => console.error('Error fetching students:', error));
    }, []);

    const handleSelectClass = (className) => {
        setSelectedClass(className);
        const filtered = students.filter(s => s.class === className && s.status === 'Active');
        setClassStudents(filtered);
    };

    return (
        <div className="page-container">
            <div className="page-header" style={{ justifyContent: 'center', position: 'relative' }}>
                <h2 style={{ margin: 0 }}>Teacher Dashboard</h2>
                <button
                    className="logout-btn"
                    style={{
                        width: 'auto',
                        padding: '0.5rem 1rem',
                        backgroundColor: 'var(--danger-color)',
                        border: 'none',
                        position: 'absolute',
                        right: 0
                    }}
                    onClick={() => {
                        localStorage.removeItem('user');
                        window.location.href = '/login';
                    }}
                >
                    Logout
                </button>
            </div>

            <div className="card" style={{ marginBottom: '2rem' }}>
                <h3>Today's Schedule</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Time</th>
                            <th>Subject</th>
                            <th>Class</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {schedule.map((slot, index) => (
                            <tr key={index}>
                                <td>{slot.time}</td>
                                <td>{slot.subject}</td>
                                <td>{slot.class}</td>
                                <td><span className="paid-badge" style={{ background: 'var(--secondary-color)', color: 'var(--text-color)' }}>Scheduled</span></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {!selectedClass ? (
                <div className="card">
                    <h3>My Classes</h3>
                    <p style={{ color: 'var(--text-light)', marginBottom: '1.5rem' }}>Select a class to view students and manage grades</p>
                    {assignedClasses.length > 0 ? (
                        <div className="cards-grid">
                            {assignedClasses.map((assignment, index) => {
                                const classStudentCount = students.filter(s => s.class === assignment.class_name && s.status === 'Active').length;
                                return (
                                    <div key={index} className="class-card" onClick={() => handleSelectClass(assignment.class_name)}>
                                        <h3>{assignment.class_name}</h3>
                                        <p>{assignment.subjects.join(', ')}</p>
                                        <p>{classStudentCount} Students</p>
                                        <button className="view-btn">View Students</button>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <p style={{ color: 'var(--text-light)', textAlign: 'center', padding: '2rem' }}>
                            No classes assigned yet. Please contact the administrator.
                        </p>
                    )}
                </div>
            ) : (
                <div className="card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <h3>{selectedClass} - Students</h3>
                        <button onClick={() => setSelectedClass(null)} className="back-btn" style={{ width: 'auto' }}>Back to Classes</button>
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Roll No</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {classStudents.map(student => (
                                <tr key={student.id}>
                                    <td>{student.name}</td>
                                    <td>{student.roll_number}</td>
                                    <td>
                                        <button onClick={() => window.location.href = `/grades/${student.id}`}>Manage Grades</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default TeacherDashboard;
