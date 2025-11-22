import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import authHeader from '../services/auth-header';

const FeeManagement = () => {
    const navigate = useNavigate();
    const [fees, setFees] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [newFee, setNewFee] = useState({
        class_name: '',
        fee_type: '',
        amount: '',
        due_date: '',
        academic_year: ''
    });

    const classes = ['Class 9A', 'Class 9B', 'Class 10A', 'Class 10B', 'Class 11A', 'Class 11B', 'Class 12A', 'Class 12B'];
    const feeTypes = ['Tuition Fee', 'Exam Fee', 'Library Fee', 'Sports Fee', 'Lab Fee', 'Transport Fee', 'Annual Fee'];

    useEffect(() => {
        fetchFees();
    }, []);

    const fetchFees = () => {
        axios.get('http://localhost:3000/api/fees', { headers: authHeader() })
            .then(response => setFees(response.data))
            .catch(error => console.error(error));
    };

    const handleAssignFee = (e) => {
        e.preventDefault();
        axios.post('http://localhost:3000/api/fees', newFee, { headers: authHeader() })
            .then(() => {
                setNewFee({
                    class_name: '',
                    fee_type: '',
                    amount: '',
                    due_date: '',
                    academic_year: ''
                });
                setShowModal(false);
                fetchFees();
            })
            .catch(error => console.error(error));
    };

    return (
        <div className="page-container">
            <div className="page-header" style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                <button onClick={() => navigate('/dashboard')} className="back-btn-icon" title="Back to Dashboard">
                    ←
                </button>
                <h2 style={{ margin: 0 }}>Fee Management</h2>
            </div>

            <div className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h3>Class-wise Fee Structure</h3>
                    <button onClick={() => setShowModal(true)}>+ Assign Fee to Class</button>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>Class</th>
                            <th>Fee Type</th>
                            <th>Amount</th>
                            <th>Due Date</th>
                            <th>Academic Year</th>
                        </tr>
                    </thead>
                    <tbody>
                        {fees.map(fee => (
                            <tr key={fee.id}>
                                <td>{fee.class_name}</td>
                                <td>{fee.fee_type}</td>
                                <td>₹{fee.amount}</td>
                                <td>{new Date(fee.due_date).toLocaleDateString()}</td>
                                <td>{fee.academic_year || 'N/A'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Assign Fee Modal */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3>Assign Fee to Class</h3>
                            <button className="close-btn" onClick={() => setShowModal(false)}>×</button>
                        </div>
                        <form onSubmit={handleAssignFee}>
                            <div className="form-group">
                                <label>Class *</label>
                                <select
                                    value={newFee.class_name}
                                    onChange={e => setNewFee({ ...newFee, class_name: e.target.value })}
                                    required
                                >
                                    <option value="">Select Class</option>
                                    {classes.map(c => (
                                        <option key={c} value={c}>{c}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Fee Type *</label>
                                <select
                                    value={newFee.fee_type}
                                    onChange={e => setNewFee({ ...newFee, fee_type: e.target.value })}
                                    required
                                >
                                    <option value="">Select Fee Type</option>
                                    {feeTypes.map(type => (
                                        <option key={type} value={type}>{type}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Amount (₹) *</label>
                                <input
                                    type="number"
                                    placeholder="5000"
                                    value={newFee.amount}
                                    onChange={e => setNewFee({ ...newFee, amount: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Due Date *</label>
                                <input
                                    type="date"
                                    value={newFee.due_date}
                                    onChange={e => setNewFee({ ...newFee, due_date: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Academic Year</label>
                                <input
                                    placeholder="2024-2025"
                                    value={newFee.academic_year}
                                    onChange={e => setNewFee({ ...newFee, academic_year: e.target.value })}
                                />
                            </div>
                            <button type="submit">Assign Fee to All Students in Class</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FeeManagement;
