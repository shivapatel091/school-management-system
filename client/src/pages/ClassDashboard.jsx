import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import authHeader from '../services/auth-header';

const ClassDashboard = () => {
    const [stats, setStats] = useState(null);
    const [selectedClass, setSelectedClass] = useState(null);
    const [classDetails, setClassDetails] = useState(null);
    const navigate = useNavigate();

    const [showAddModal, setShowAddModal] = useState(false);
    const [newStudent, setNewStudent] = useState({
        name: '',
        roll_number: '',
        class: '',
        date_of_birth: '',
        gender: '',
        blood_group: '',
        aadhar_number: '',
        address: '',
        parent_name: '',
        parent_phone: '',
        parent_email: '',
        photo_url: ''
    });
    const [teacherAssignments, setTeacherAssignments] = useState([]);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = () => {
        setLoading(true);
        axios.get('http://localhost:3000/api/classes/stats', { headers: authHeader() })
            .then(response => {
                if (Array.isArray(response.data)) {
                    setStats(response.data);
                } else {
                    console.error("Invalid data format for class stats:", response.data);
                    setStats([]);
                }
                setLoading(false);
            })
            .catch(error => {
                console.error(error);
                setLoading(false);
            });
    };

    const handleViewClass = (className) => {
        setSelectedClass(className);
        fetchClassDetails(className);
    };

    const fetchClassDetails = (className) => {
        setLoading(true);
        axios.get(`http://localhost:3000/api/classes/${className}`, { headers: authHeader() })
            .then(response => {
                if (Array.isArray(response.data)) {
                    setClassDetails(response.data);
                } else {
                    setClassDetails([]);
                }
                setLoading(false);
            })
            .catch(error => {
                console.error(error);
                setLoading(false);
            });

        // Fetch teacher assignments for this class
        axios.get('http://localhost:3000/api/teacher-assignments/all', { headers: authHeader() })
            .then(response => {
                const classTeachers = response.data.filter(a => a.class_name === className);
                setTeacherAssignments(classTeachers);
            })
            .catch(error => console.error('Error fetching teacher assignments:', error));
    };

    const handleAddStudent = (e) => {
        e.preventDefault();
        axios.post('http://localhost:3000/api/students', { ...newStudent, class: selectedClass, status: 'Active' }, { headers: authHeader() })
            .then(() => {
                setNewStudent({
                    name: '',
                    roll_number: '',
                    class: '',
                    date_of_birth: '',
                    gender: '',
                    blood_group: '',
                    aadhar_number: '',
                    address: '',
                    parent_name: '',
                    parent_phone: '',
                    parent_email: '',
                    photo_url: ''
                });
                setShowAddModal(false);
                fetchClassDetails(selectedClass);
                fetchStats(); // Update stats too
            })
            .catch(error => console.error(error));
    };

    const handleRemoveStudent = (studentId) => {
        if (window.confirm('Are you sure you want to remove this student? They will be marked as "Left".')) {
            axios.put(`http://localhost:3000/api/students/${studentId}`, { status: 'Left' }, { headers: authHeader() })
                .then(() => {
                    fetchClassDetails(selectedClass);
                    fetchStats();
                })
                .catch(error => console.error(error));
        }
    };

    if (loading && !stats && !selectedClass) {
        return <div className="page-container">Loading...</div>;
    }

    return (
        <div className="page-container">
            <div className="page-header" style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                <button onClick={() => navigate('/dashboard')} className="back-btn-icon" title="Back to Dashboard">
                    ←
                </button>
                <h2 style={{ margin: 0 }}>Class Dashboard</h2>
            </div>

            {!selectedClass ? (
                <div className="card">
                    <h3>Class Statistics</h3>
                    {stats && stats.length > 0 ? (
                        <table>
                            <thead>
                                <tr>
                                    <th>Class</th>
                                    <th>Students</th>
                                    <th>Average %</th>
                                    <th>Topper</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stats.map((stat, index) => (
                                    <tr key={index}>
                                        <td>{stat.className}</td>
                                        <td>{stat.studentCount}</td>
                                        <td>{stat?.averagePercentage?.toFixed(2) || '0.00'}%</td>
                                        <td>{stat.topper ? `${stat.topper.name} (${stat.topper.percentage?.toFixed(2) || '0.00'}%)` : 'N/A'}</td>
                                        <td>
                                            <button onClick={() => handleViewClass(stat.className)}>View Details</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p>No class data available.</p>
                    )}
                </div>
            ) : (
                <div className="card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <h3>Class: {selectedClass}</h3>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button onClick={() => setShowAddModal(true)}>+ Add Student</button>
                            <button onClick={() => setSelectedClass(null)} className="back-btn" style={{ width: 'auto' }}>Back to Stats</button>
                        </div>

                        {/* Teacher Assignments Card */}
                        <div className="card">
                            <h3>Assigned Teachers</h3>
                            {teacherAssignments.length > 0 ? (
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Teacher</th>
                                            <th>Subject</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {teacherAssignments.map((assignment, index) => (
                                            <tr key={index}>
                                                <td>{assignment.User?.name || assignment.User?.username || `Teacher #${assignment.user_id}`}</td>
                                                <td>{assignment.subject}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <p style={{ color: 'var(--text-light)', textAlign: 'center', padding: '2rem' }}>
                                    No teachers assigned to this class yet.
                                </p>
                            )}
                        </div>
                    </div>

                    <h4>Student Rankings</h4>
                    {classDetails && classDetails.length > 0 ? (
                        <table>
                            <thead>
                                <tr>
                                    <th>Rank</th>
                                    <th>Name</th>
                                    <th>Roll No</th>
                                    <th>Percentage</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {classDetails.map((student, index) => (
                                    <tr key={student.id}>
                                        <td>{index + 1}</td>
                                        <td>{student.name}</td>
                                        <td>{student.roll_number}</td>
                                        <td>{student.percentage ? Number(student.percentage).toFixed(2) : '0.00'}%</td>
                                        <td>
                                            <button
                                                onClick={() => handleRemoveStudent(student.id)}
                                                style={{ backgroundColor: 'var(--danger-color)', padding: '0.5rem' }}
                                            >
                                                Remove
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p>No students in this class.</p>
                    )}
                </div>
            )}

            {/* ... modal ... */}

            {/* Add Student Modal */}
            {showAddModal && (
                <div className="modal-overlay">
                    <div className="modal-content" style={{ maxWidth: '700px', maxHeight: '90vh', overflowY: 'auto' }}>
                        <div className="modal-header">
                            <h3>Add New Student to {selectedClass}</h3>
                            <button className="close-btn" onClick={() => setShowAddModal(false)}>×</button>
                        </div>
                        <form onSubmit={handleAddStudent}>
                            <h4 style={{ marginTop: 0, marginBottom: '1rem', color: 'var(--primary-color)' }}>Personal Information</h4>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div className="form-group">
                                    <label>Full Name *</label>
                                    <input
                                        placeholder="John Doe"
                                        value={newStudent.name}
                                        onChange={e => setNewStudent({ ...newStudent, name: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Roll Number *</label>
                                    <input
                                        placeholder="001"
                                        value={newStudent.roll_number}
                                        onChange={e => setNewStudent({ ...newStudent, roll_number: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                                <div className="form-group">
                                    <label>Date of Birth</label>
                                    <input
                                        type="date"
                                        value={newStudent.date_of_birth}
                                        onChange={e => setNewStudent({ ...newStudent, date_of_birth: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Gender</label>
                                    <select
                                        value={newStudent.gender}
                                        onChange={e => setNewStudent({ ...newStudent, gender: e.target.value })}
                                    >
                                        <option value="">Select</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Blood Group</label>
                                    <select
                                        value={newStudent.blood_group}
                                        onChange={e => setNewStudent({ ...newStudent, blood_group: e.target.value })}
                                    >
                                        <option value="">Select</option>
                                        <option value="A+">A+</option>
                                        <option value="A-">A-</option>
                                        <option value="B+">B+</option>
                                        <option value="B-">B-</option>
                                        <option value="AB+">AB+</option>
                                        <option value="AB-">AB-</option>
                                        <option value="O+">O+</option>
                                        <option value="O-">O-</option>
                                    </select>
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Aadhar Number</label>
                                <input
                                    placeholder="1234 5678 9012"
                                    value={newStudent.aadhar_number}
                                    onChange={e => setNewStudent({ ...newStudent, aadhar_number: e.target.value })}
                                    maxLength="12"
                                />
                            </div>
                            <div className="form-group">
                                <label>Address</label>
                                <textarea
                                    placeholder="Full address"
                                    value={newStudent.address}
                                    onChange={e => setNewStudent({ ...newStudent, address: e.target.value })}
                                    rows="2"
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        border: '1px solid var(--border-color)',
                                        borderRadius: '8px',
                                        fontFamily: 'Inter, sans-serif',
                                        fontSize: '1rem',
                                        resize: 'vertical'
                                    }}
                                />
                            </div>

                            <h4 style={{ marginTop: '1.5rem', marginBottom: '1rem', color: 'var(--primary-color)' }}>Parent/Guardian Information</h4>
                            <div className="form-group">
                                <label>Parent/Guardian Name</label>
                                <input
                                    placeholder="Parent name"
                                    value={newStudent.parent_name}
                                    onChange={e => setNewStudent({ ...newStudent, parent_name: e.target.value })}
                                />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div className="form-group">
                                    <label>Parent Phone</label>
                                    <input
                                        type="tel"
                                        placeholder="+91 1234567890"
                                        value={newStudent.parent_phone}
                                        onChange={e => setNewStudent({ ...newStudent, parent_phone: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Parent Email</label>
                                    <input
                                        type="email"
                                        placeholder="parent@email.com"
                                        value={newStudent.parent_email}
                                        onChange={e => setNewStudent({ ...newStudent, parent_email: e.target.value })}
                                    />
                                </div>
                            </div>

                            <h4 style={{ marginTop: '1.5rem', marginBottom: '1rem', color: 'var(--primary-color)' }}>Additional Information</h4>
                            <div className="form-group">
                                <label>Photo URL</label>
                                <input
                                    type="url"
                                    placeholder="https://example.com/photo.jpg"
                                    value={newStudent.photo_url}
                                    onChange={e => setNewStudent({ ...newStudent, photo_url: e.target.value })}
                                />
                                <small style={{ color: 'var(--text-light)', fontSize: '0.85rem' }}>
                                    Enter a URL to the student's photo
                                </small>
                            </div>

                            <button type="submit" style={{ marginTop: '1rem', width: '100%' }}>Add Student</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ClassDashboard;
