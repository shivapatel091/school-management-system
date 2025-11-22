const Fee = require('../models/Fee');
const FeePayment = require('../models/FeePayment');
const Student = require('../models/Student');

exports.assignFee = async (req, res) => {
    try {
        const fee = await Fee.create(req.body);
        res.send(fee);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

exports.getStudentFees = async (req, res) => {
    try {
        const fees = await Fee.findAll({
            where: { student_id: req.params.studentId },
            include: [FeePayment]
        });

        // Calculate remaining
        const feesWithBalance = fees.map(fee => {
            const paid = fee.FeePayments.reduce((sum, p) => sum + p.amount_paid, 0);
            return {
                ...fee.toJSON(),
                paid,
                remaining: fee.total_amount - paid
            };
        });

        res.send(feesWithBalance);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

exports.payFee = async (req, res) => {
    try {
        const payment = await FeePayment.create(req.body);
        res.send(payment);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
}
