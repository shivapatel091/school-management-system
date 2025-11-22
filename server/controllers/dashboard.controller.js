const Student = require('../models/Student');
const Fee = require('../models/Fee');
const FeePayment = require('../models/FeePayment');

exports.getStats = async (req, res) => {
    try {
        const students = await Student.findAll();
        // Filter active students for total count, or show all? Usually dashboard shows active.
        // Let's show active students count.
        const activeStudents = students.filter(s => s.status !== 'Left');
        const totalStudents = activeStudents.length;

        // Group by class
        const classes = {};

        for (const student of students) {
            // Only include active students in class stats? Or all?
            // Usually class stats should reflect current class strength.
            if (student.status === 'Left') continue;

            if (!classes[student.class]) {
                classes[student.class] = {
                    name: student.class,
                    studentCount: 0,
                    totalFee: 0,
                    collectedFee: 0,
                    remainingFee: 0
                };
            }
            classes[student.class].studentCount++;

            const fees = await Fee.findAll({
                where: { student_id: student.id },
                include: [FeePayment]
            });

            fees.forEach(fee => {
                classes[student.class].totalFee += fee.total_amount;
                const paid = fee.FeePayments.reduce((sum, p) => sum + p.amount_paid, 0);
                classes[student.class].collectedFee += paid;
                classes[student.class].remainingFee += (fee.total_amount - paid);
            });
        }

        res.send({
            totalStudents,
            classStats: Object.values(classes)
        });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

exports.getDefaultedFees = async (req, res) => {
    try {
        const students = await Student.findAll({
            where: { status: 'Left' }
        });

        const defaultedStudents = [];

        for (const student of students) {
            const fees = await Fee.findAll({
                where: { student_id: student.id },
                include: [FeePayment]
            });

            let totalRemaining = 0;
            fees.forEach(fee => {
                const paid = fee.FeePayments.reduce((sum, p) => sum + p.amount_paid, 0);
                totalRemaining += (fee.total_amount - paid);
            });

            if (totalRemaining > 0) {
                defaultedStudents.push({
                    id: student.id,
                    name: student.name,
                    roll_number: student.roll_number,
                    class: student.class,
                    amount: totalRemaining
                });
            }
        }

        res.send(defaultedStudents);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};
