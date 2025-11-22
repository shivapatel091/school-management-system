import React, { useState, useEffect } from 'react';
import axios from 'axios';
import authHeader from '../services/auth-header';

const TeacherManagement = () => {
    const [teachers, setTeachers] = useState([]);
    const [assignments, setAssignments] = useState([]);
    const [schedules, setSchedules] = useState([]);
    const [activeTab, setActiveTab] = useState('teachers'); // teachers, assignments, schedules

    // Form states
    const [showAddTeacherModal, setShowAddTeacherModal] = useState(false);
    const [showAssignModal, setShowAssignModal] = useState(false);
    const [showScheduleModal, setShowScheduleModal] = useState(false);

    const [newTeacher, setNewTeacher] = useState({
        username: '',
        password: '',
        role: 'teacher',
        name: '',
        email: '',
        phone: '',
        employee_id: '',
        specialization: ''
    });
    const [newAssignment, setNewAssignment] = useState({ user_id: '', class_name: '', subject: '' });
    const [newSchedule, setNewSchedule] = useState({
        user_id: '',
        class_name: '',
        subject: '',
        day_of_week: '',
        start_time: '',
        end_time: ''
    });

    const classes = ['Class 9A', 'Class 9B', 'Class 10A', 'Class 10B', 'Class 11A', 'Class 11B', 'Class 12A', 'Class 12B'];
    const subjects = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'History', 'Geography'];
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = () => {
        // Fetch all users (filter teachers on frontend)
        axios.get('http://localhost:3000/api/auth/users', { headers: authHeader() })
            .then(response => {
                const teacherUsers = response.data.filter(u => u.role === 'teacher');
                setTeachers(teacherUsers);
            })
            .catch(error => console.error('Error fetching teachers:', error));

        // Fetch assignments
        axios.get('http://localhost:3000/api/teacher-assignments/all', { headers: authHeader() })
            .then(response => setAssignments(response.data))
            .catch(error => console.error('Error fetching assignments:', error));

        // Fetch schedules
        axios.get('http://localhost:3000/api/schedules/all', { headers: authHeader() })
            .then(response => setSchedules(response.data))
            .catch(error => console.error('Error fetching schedules:', error));
    };

    const handleAddTeacher = (e) => {
        e.preventDefault();
        axios.post('http://localhost:3000/api/auth/register', newTeacher, { headers: authHeader() })
            .then(() => {
                setNewTeacher({
                    username: '',
                    password: '',
                    role: 'teacher',
                    name: '',
                    email: '',
                    phone: '',
                    employee_id: '',
                    specialization: ''
                });
                setShowAddTeacherModal(false);
                fetchData();
            })
            .catch(error => console.error('Error adding teacher:', error));
    };

    const handleAssignTeacher = (e) => {
        e.preventDefault();
        axios.post('http://localhost:3000/api/teacher-assignments', newAssignment, { headers: authHeader() })
            .then(() => {
                setNewAssignment({ user_id: '', class_name: '', subject: '' });
                setShowAssignModal(false);
                fetchData();
            })
            .catch(error => console.error('Error assigning teacher:', error));
    };

    const handleCreateSchedule = (e) => {
        e.preventDefault();
        axios.post('http://localhost:3000/api/schedules', newSchedule, { headers: authHeader() })
            .then(() => {
                setNewSchedule({ user_id: '', class_name: '', subject: '', day_of_week: '', start_time: '', end_time: '' });
                setShowScheduleModal(false);
                fetchData();
            })
            .catch(error => console.error('Error creating schedule:', error));
    };

    const handleRemoveAssignment = (id) => {
        if (window.confirm('Remove this assignment?')) {
            axios.delete(`http://localhost:3000/api/teacher-assignments/${id}`, { headers: authHeader() })
                .then(() => fetchData())
                .catch(error => console.error('Error removing assignment:', error));
        }
    };

    const handleDeleteSchedule = (id) => {
        if (window.confirm('Delete this schedule entry?')) {
            axios.delete(`http://localhost:3000/api/schedules/${id}`, { headers: authHeader() })
                .then(() => fetchData())
                .catch(error => console.error('Error deleting schedule:', error));
        }
    };

    return (
        <div className="page-container">
            <div className="page-header">
                <h2 style={{ margin: 0 }}>Teacher Management</h2>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '2px solid var(--border-color)' }}>
                <button
                    onClick={() => setActiveTab('teachers')}
                    style={{
                        background: activeTab === 'teachers' ? 'var(--primary-color)' : 'transparent',
                        color: activeTab === 'teachers' ? 'white' : 'var(--text-color)',
                        borderBottom: activeTab === 'teachers' ? '3px solid var(--primary-color)' : 'none',
                        borderRadius: '8px 8px 0 0'
                    }}
                >
                    Teachers
                </button>
                <button
                    onClick={() => setActiveTab('assignments')}
                    style={{
                        background: activeTab === 'assignments' ? 'var(--primary-color)' : 'transparent',
                        color: activeTab === 'assignments' ? 'white' : 'var(--text-color)',
                        borderBottom: activeTab === 'assignments' ? '3px solid var(--primary-color)' : 'none',
                        borderRadius: '8px 8px 0 0'
                    }}
                >
                    Class Assignments
                </button>
                <button
                    onClick={() => setActiveTab('schedules')}
                    style={{
                        background: activeTab === 'schedules' ? 'var(--primary-color)' : 'transparent',
                        color: activeTab === 'schedules' ? 'white' : 'var(--text-color)',
                        borderBottom: activeTab === 'schedules' ? '3px solid var(--primary-color)' : 'none',
                        borderRadius: '8px 8px 0 0'
                    }}
                >
                    Schedules
                </button>
            </div>

            {/* Teachers Tab */}
            {activeTab === 'teachers' && (
                <div className="card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <h3>All Teachers</h3>
                        <button onClick={() => setShowAddTeacherModal(true)}>+ Add Teacher</button>
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <th>Employee ID</th>
                                <th>Name</th>
                                <th>Username</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Specialization</th>
                            </tr>
                        </thead>
                        <tbody>
                            {teachers.map(teacher => (
                                <tr key={teacher.id}>
                                    <td>{teacher.employee_id || '-'}</td>
                                    <td>{teacher.name || '-'}</td>
                                    <td>{teacher.username}</td>
                                    <td>{teacher.email || '-'}</td>
                                    <td>{teacher.phone || '-'}</td>
                                    <td>{teacher.specialization || '-'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Assignments Tab */}
            {activeTab === 'assignments' && (
                <div className="card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <h3>Teacher-Class Assignments</h3>
                        <button onClick={() => setShowAssignModal(true)}>+ Assign Teacher</button>
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <th>Teacher</th>
                                <th>Class</th>
                                <th>Subject</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {assignments.map(assignment => (
                                <tr key={assignment.id}>
                                    <td>{assignment.User?.username || `User #${assignment.user_id}`}</td>
                                    <td>{assignment.class_name}</td>
                                    <td>{assignment.subject}</td>
                                    <td>
                                        <button
                                            onClick={() => handleRemoveAssignment(assignment.id)}
                                            style={{ backgroundColor: 'var(--danger-color)', padding: '0.5rem' }}
                                        >
                                            Remove
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Schedules Tab */}
            {activeTab === 'schedules' && (
                <div className="card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <h3>Class Schedules</h3>
                        <button onClick={() => setShowScheduleModal(true)}>+ Add Schedule</button>
                    </div>
                    <p style={{ color: 'var(--text-light)', marginBottom: '1rem', fontSize: '0.9rem' }}>
                        💡 Future: ML-based automatic schedule generation will be available here
                    </p>
                    <table>
                        <thead>
                            <tr>
                                <th>Teacher</th>
                                <th>Class</th>
                                <th>Subject</th>
                                <th>Day</th>
                                <th>Time</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {schedules.map(schedule => (
                                <tr key={schedule.id}>
                                    <td>{schedule.User?.username || `User #${schedule.user_id}`}</td>
                                    <td>{schedule.class_name}</td>
                                    <td>{schedule.subject}</td>
                                    <td>{days[schedule.day_of_week]}</td>
                                    <td>{schedule.start_time} - {schedule.end_time}</td>
                                    <td>
                                        <button
                                            onClick={() => handleDeleteSchedule(schedule.id)}
                                            style={{ backgroundColor: 'var(--danger-color)', padding: '0.5rem' }}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Add Teacher Modal */}
            {showAddTeacherModal && (
                <div className="modal-overlay">
                    <div className="modal-content" style={{ maxWidth: '600px' }}>
                        <div className="modal-header">
                            <h3>Add New Teacher</h3>
                            <button className="close-btn" onClick={() => setShowAddTeacherModal(false)}>×</button>
                        </div>
                        <form onSubmit={handleAddTeacher}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div className="form-group">
                                    <label>Full Name *</label>
                                    <input
                                        placeholder="John Doe"
                                        value={newTeacher.name}
                                        onChange={e => setNewTeacher({ ...newTeacher, name: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Employee ID</label>
                                    <input
                                        placeholder="EMP001"
                                        value={newTeacher.employee_id}
                                        onChange={e => setNewTeacher({ ...newTeacher, employee_id: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div className="form-group">
                                    <label>Username *</label>
                                    <input
                                        placeholder="john.doe"
                                        value={newTeacher.username}
                                        onChange={e => setNewTeacher({ ...newTeacher, username: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Password *</label>
                                    <input
                                        type="password"
                                        placeholder="Password"
                                        value={newTeacher.password}
                                        onChange={e => setNewTeacher({ ...newTeacher, password: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div className="form-group">
                                    <label>Email</label>
                                    <input
                                        type="email"
                                        placeholder="john.doe@school.com"
                                        value={newTeacher.email}
                                        onChange={e => setNewTeacher({ ...newTeacher, email: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Phone</label>
                                    <input
                                        type="tel"
                                        placeholder="+1234567890"
                                        value={newTeacher.phone}
                                        onChange={e => setNewTeacher({ ...newTeacher, phone: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Specialization (Primary Subjects)</label>
                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(2, 1fr)',
                                    gap: '0.5rem',
                                    padding: '0.75rem',
                                    border: '1px solid var(--border-color)',
                                    borderRadius: '8px',
                                    backgroundColor: 'var(--secondary-color)'
                                }}>
                                    {subjects.map(subject => (
                                        <label key={subject} style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.5rem',
                                            cursor: 'pointer',
                                            fontSize: '0.9rem'
                                        }}>
                                            <input
                                                type="checkbox"
                                                checked={newTeacher.specialization?.split(',').includes(subject) || false}
                                                onChange={e => {
                                                    const current = newTeacher.specialization ? newTeacher.specialization.split(',').filter(s => s) : [];
                                                    if (e.target.checked) {
                                                        current.push(subject);
                                                    } else {
                                                        const index = current.indexOf(subject);
                                                        if (index > -1) current.splice(index, 1);
                                                    }
                                                    setNewTeacher({ ...newTeacher, specialization: current.join(',') });
                                                }}
                                                style={{ cursor: 'pointer' }}
                                            />
                                            {subject}
                                        </label>
                                    ))}
                                </div>
                            </div>
                            <button type="submit">Add Teacher</button>
                        </form>
                    </div>
                </div>
            )}

            {/* Assign Teacher Modal */}
            {showAssignModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3>Assign Teacher to Class</h3>
                            <button className="close-btn" onClick={() => setShowAssignModal(false)}>×</button>
                        </div>
                        <form onSubmit={handleAssignTeacher}>
                            <div className="form-group">
                                <label>Teacher</label>
                                <select
                                    value={newAssignment.user_id}
                                    onChange={e => setNewAssignment({ ...newAssignment, user_id: e.target.value })}
                                    required
                                >
                                    <option value="">Select Teacher</option>
                                    {teachers.map(t => (
                                        <option key={t.id} value={t.id}>{t.username}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Class</label>
                                <select
                                    value={newAssignment.class_name}
                                    onChange={e => setNewAssignment({ ...newAssignment, class_name: e.target.value })}
                                    required
                                >
                                    <option value="">Select Class</option>
                                    {classes.map(c => (
                                        <option key={c} value={c}>{c}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Subject</label>
                                <select
                                    value={newAssignment.subject}
                                    onChange={e => setNewAssignment({ ...newAssignment, subject: e.target.value })}
                                    required
                                >
                                    <option value="">Select Subject</option>
                                    {subjects.map(s => (
                                        <option key={s} value={s}>{s}</option>
                                    ))}
                                </select>
                            </div>
                            <button type="submit">Assign Teacher</button>
                        </form>
                    </div>
                </div>
            )}

            {/* Add Schedule Modal */}
            {showScheduleModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3>Create Schedule Entry</h3>
                            <button className="close-btn" onClick={() => setShowScheduleModal(false)}>×</button>
                        </div>
                        <form onSubmit={handleCreateSchedule}>
                            <div className="form-group">
                                <label>Teacher</label>
                                <select
                                    value={newSchedule.user_id}
                                    onChange={e => setNewSchedule({ ...newSchedule, user_id: e.target.value })}
                                    required
                                >
                                    <option value="">Select Teacher</option>
                                    {teachers.map(t => (
                                        <option key={t.id} value={t.id}>{t.username}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Class</label>
                                <select
                                    value={newSchedule.class_name}
                                    onChange={e => setNewSchedule({ ...newSchedule, class_name: e.target.value })}
                                    required
                                >
                                    <option value="">Select Class</option>
                                    {classes.map(c => (
                                        <option key={c} value={c}>{c}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Subject</label>
                                <select
                                    value={newSchedule.subject}
                                    onChange={e => setNewSchedule({ ...newSchedule, subject: e.target.value })}
                                    required
                                >
                                    <option value="">Select Subject</option>
                                    {subjects.map(s => (
                                        <option key={s} value={s}>{s}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Day of Week</label>
                                <select
                                    value={newSchedule.day_of_week}
                                    onChange={e => setNewSchedule({ ...newSchedule, day_of_week: e.target.value })}
                                    required
                                >
                                    <option value="">Select Day</option>
                                    {days.map((day, index) => (
                                        <option key={index} value={index}>{day}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Start Time (HH:MM)</label>
                                <input
                                    type="time"
                                    value={newSchedule.start_time}
                                    onChange={e => setNewSchedule({ ...newSchedule, start_time: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>End Time (HH:MM)</label>
                                <input
                                    type="time"
                                    value={newSchedule.end_time}
                                    onChange={e => setNewSchedule({ ...newSchedule, end_time: e.target.value })}
                                    required
                                />
                            </div>
                            <button type="submit">Create Schedule</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TeacherManagement;
