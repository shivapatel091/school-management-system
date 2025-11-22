import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import authHeader from '../services/auth-header';

const GradeManagement = () => {
    const { studentId } = useParams();
    const navigate = useNavigate();
    const [grades, setGrades] = useState([]);
    const [newGrade, setNewGrade] = useState({ subject: '', score: '', max_score: '', term: '' });
    const [sheet, setSheet] = useState(null);

    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        fetchGrades();
    }, [studentId]);

    const fetchGrades = () => {
        axios.get(`http://localhost:3000/api/grades/student/${studentId}`, { headers: authHeader() })
            .then(response => setGrades(response.data))
            .catch(error => console.error(error));
    };

    const handleAddGrade = (e) => {
        e.preventDefault();
        axios.post('http://localhost:3000/api/grades', { ...newGrade, student_id: studentId }, { headers: authHeader() })
            .then(() => {
                setNewGrade({ subject: '', score: '', max_score: '', term: '' });
                setShowModal(false);
                fetchGrades();
            })
            .catch(error => console.error(error));
    };

    const generateSheet = () => {
        axios.get(`http://localhost:3000/api/grades/sheet/${studentId}`, { headers: authHeader() })
            .then(response => setSheet(response.data))
            .catch(error => console.error(error));
    };

    return (
        <div className="page-container">
            <div className="page-header" style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                <button onClick={() => navigate('/dashboard')} className="back-btn-icon" title="Back to Dashboard">
                    ←
                </button>
                <h2 style={{ margin: 0 }}>Grade Management</h2>
            </div>

            <div className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h3>Recorded Grades</h3>
                    <button onClick={() => setShowModal(true)} style={{ width: 'auto' }}>+ Add New Grade</button>
                </div>

                {grades.length > 0 ? (
                    <table>
                        <thead>
                            <tr>
                                <th>Subject</th>
                                <th>Term</th>
                                <th>Score</th>
                            </tr>
                        </thead>
                        <tbody>
                            {grades.map(grade => (
                                <tr key={grade.id}>
                                    <td>{grade.subject}</td>
                                    <td>{grade.term}</td>
                                    <td>{grade.score} / {grade.max_score}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No grades recorded yet.</p>
                )}

                <div style={{ marginTop: '1.5rem' }}>
                    <button onClick={generateSheet} className="generate-btn">Generate Grade Sheet</button>
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3>Add Grade</h3>
                            <button className="close-btn" onClick={() => setShowModal(false)}>×</button>
                        </div>
                        <form onSubmit={handleAddGrade}>
                            <div className="form-group">
                                <label>Subject</label>
                                <input placeholder="e.g. Mathematics" value={newGrade.subject} onChange={e => setNewGrade({ ...newGrade, subject: e.target.value })} required />
                            </div>
                            <div className="form-group">
                                <label>Score</label>
                                <input type="number" placeholder="e.g. 85" value={newGrade.score} onChange={e => setNewGrade({ ...newGrade, score: e.target.value })} required />
                            </div>
                            <div className="form-group">
                                <label>Max Score</label>
                                <input type="number" placeholder="e.g. 100" value={newGrade.max_score} onChange={e => setNewGrade({ ...newGrade, max_score: e.target.value })} required />
                            </div>
                            <div className="form-group">
                                <label>Term</label>
                                <input placeholder="e.g. Midterm" value={newGrade.term} onChange={e => setNewGrade({ ...newGrade, term: e.target.value })} required />
                            </div>
                            <button type="submit">Save Grade</button>
                        </form>
                    </div>
                </div>
            )}

            {sheet && (
                <div className="card grade-sheet" style={{ marginTop: '2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <h3>Grade Sheet: {sheet.student}</h3>
                        <button
                            onClick={() => import('../utils/PDFGenerator').then(module =>
                                module.default(sheet.student, sheet.roll_number, sheet.grades, sheet.totalScore, sheet.totalMax, sheet.percentage)
                            )}
                            style={{ backgroundColor: '#e67e22', width: 'auto' }}
                        >
                            Download PDF
                        </button>
                    </div>
                    <p>Roll No: {sheet.roll_number}</p>
                    <table>
                        <thead>
                            <tr>
                                <th>Subject</th>
                                <th>Term</th>
                                <th>Score</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sheet.grades.map(g => (
                                <tr key={g.id}>
                                    <td>{g.subject}</td>
                                    <td>{g.term}</td>
                                    <td>{g.score}/{g.max_score}</td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr>
                                <td colSpan="2"><strong>Total</strong></td>
                                <td><strong>{sheet.totalScore}/{sheet.totalMax} ({sheet.percentage})</strong></td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            )}
        </div>
    );
};

export default GradeManagement;
