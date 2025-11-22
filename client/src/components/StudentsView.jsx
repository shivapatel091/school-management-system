import React, { useState, useEffect } from 'react';
import axios from 'axios';
import authHeader from '../services/auth-header';

const StudentsView = () => {
    const [students, setStudents] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingStudent, setEditingStudent] = useState(null);
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
        photo_url: '',
        status: 'Active'
    });
    const [filteredStudents, setFilteredStudents] = useState([]);

    useEffect(() => {
        fetchStudents();
    }, []);

    useEffect(() => {
        const results = students.filter(student =>
            student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.roll_number.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredStudents(results);
    }, [searchTerm, students]);

    const fetchStudents = () => {
        axios.get('http://localhost:3000/api/students', { headers: authHeader() })
            .then(response => {
                setStudents(response.data);
                setFilteredStudents(response.data);
            })
            .catch(error => console.error(error));
    };

    const handleEdit = (student) => {
        setEditingStudent(student);
        setNewStudent(student);
        setShowModal(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const url = editingStudent
            ? `http://localhost:3000/api/students/${editingStudent.id}`
            : 'http://localhost:3000/api/students';
        const method = editingStudent ? 'put' : 'post';

        axios[method](url, newStudent, { headers: authHeader() })
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
                    photo_url: '',
                    status: 'Active'
                });
                setShowModal(false);
                setEditingStudent(null);
                fetchStudents();
            })
            .catch(error => console.error(error));
    };

    const classes = ['Class 9A', 'Class 9B', 'Class 10A', 'Class 10B', 'Class 11A', 'Class 11B', 'Class 12A', 'Class 12B'];

    return (
        <div className="students-view">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h2>All Students</h2>
                <button onClick={() => { setEditingStudent(null); setNewStudent({ name: '', roll_number: '', class: '', date_of_birth: '', gender: '', blood_group: '', aadhar_number: '', address: '', parent_name: '', parent_phone: '', parent_email: '', photo_url: '', status: 'Active' }); setShowModal(true); }}>+ Add Student</button>
            </div>

            <div className="search-bar" style={{ marginBottom: '1rem' }}>
                <input
                    type="text"
                    placeholder="Search by Name or Roll Number..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                        padding: '0.5rem',
                        width: '100%',
                        maxWidth: '400px',
                        borderRadius: '4px',
                        border: '1px solid #ccc'
                    }}
                />
            </div>

            <div className="card">
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Roll No</th>
                            <th>Class</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredStudents.length > 0 ? (
                            filteredStudents.map(student => (
                                <tr key={student.id}>
                                    <td>{student.name}</td>
                                    <td>{student.roll_number}</td>
                                    <td>{student.class}</td>
                                    <td>
                                        <button onClick={() => handleEdit(student)} style={{ marginRight: '5px' }}>Edit</button>
                                        <button onClick={() => window.location.href = `/fees/${student.id}`}>Manage Fees</button>
                                        <button onClick={() => window.location.href = `/grades/${student.id}`} style={{ marginLeft: '5px', backgroundColor: '#9b59b6' }}>View Grades</button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" style={{ textAlign: 'center' }}>No students found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Add/Edit Student Modal - Same as ClassDashboard */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content" style={{ maxWidth: '700px', maxHeight: '90vh', overflowY: 'auto' }}>
                        <div className="modal-header">
                            <h3>{editingStudent ? 'Edit Student' : 'Add New Student'}</h3>
                            <button className="close-btn" onClick={() => setShowModal(false)}>×</button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <h4 style={{ marginTop: 0, marginBottom: '1rem', color: 'var(--primary-color)' }}>Personal Information</h4>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div className="form-group">
                                    <label>Full Name *</label>
                                    <input placeholder="John Doe" value={newStudent.name} onChange={e => setNewStudent({ ...newStudent, name: e.target.value })} required />
                                </div>
                                <div className="form-group">
                                    <label>Roll Number *</label>
                                    <input placeholder="001" value={newStudent.roll_number} onChange={e => setNewStudent({ ...newStudent, roll_number: e.target.value })} required />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Class *</label>
                                <select value={newStudent.class} onChange={e => setNewStudent({ ...newStudent, class: e.target.value })} required>
                                    <option value="">Select Class</option>
                                    {classes.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                                <div className="form-group">
                                    <label>Date of Birth</label>
                                    <input type="date" value={newStudent.date_of_birth || ''} onChange={e => setNewStudent({ ...newStudent, date_of_birth: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label>Gender</label>
                                    <select value={newStudent.gender || ''} onChange={e => setNewStudent({ ...newStudent, gender: e.target.value })}>
                                        <option value="">Select</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Blood Group</label>
                                    <select value={newStudent.blood_group || ''} onChange={e => setNewStudent({ ...newStudent, blood_group: e.target.value })}>
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
                                <input placeholder="1234 5678 9012" value={newStudent.aadhar_number || ''} onChange={e => setNewStudent({ ...newStudent, aadhar_number: e.target.value })} maxLength="12" />
                            </div>
                            <div className="form-group">
                                <label>Address</label>
                                <textarea placeholder="Full address" value={newStudent.address || ''} onChange={e => setNewStudent({ ...newStudent, address: e.target.value })} rows="2" style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--border-color)', borderRadius: '8px', fontFamily: 'Inter, sans-serif', fontSize: '1rem', resize: 'vertical' }} />
                            </div>

                            <h4 style={{ marginTop: '1.5rem', marginBottom: '1rem', color: 'var(--primary-color)' }}>Parent/Guardian Information</h4>
                            <div className="form-group">
                                <label>Parent/Guardian Name</label>
                                <input placeholder="Parent name" value={newStudent.parent_name || ''} onChange={e => setNewStudent({ ...newStudent, parent_name: e.target.value })} />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div className="form-group">
                                    <label>Parent Phone</label>
                                    <input type="tel" placeholder="+91 1234567890" value={newStudent.parent_phone || ''} onChange={e => setNewStudent({ ...newStudent, parent_phone: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label>Parent Email</label>
                                    <input type="email" placeholder="parent@email.com" value={newStudent.parent_email || ''} onChange={e => setNewStudent({ ...newStudent, parent_email: e.target.value })} />
                                </div>
                            </div>

                            <h4 style={{ marginTop: '1.5rem', marginBottom: '1rem', color: 'var(--primary-color)' }}>Additional Information</h4>
                            <div className="form-group">
                                <label>Photo URL</label>
                                <input type="url" placeholder="https://example.com/photo.jpg" value={newStudent.photo_url || ''} onChange={e => setNewStudent({ ...newStudent, photo_url: e.target.value })} />
                                <small style={{ color: 'var(--text-light)', fontSize: '0.85rem' }}>Enter a URL to the student's photo</small>
                            </div>

                            <button type="submit" style={{ marginTop: '1rem', width: '100%' }}>{editingStudent ? 'Update Student' : 'Add Student'}</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudentsView;
