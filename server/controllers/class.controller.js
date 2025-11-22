const Student = require('../models/Student');
const Grade = require('../models/Grade');
const sequelize = require('../config/database');

exports.getClassStats = async (req, res) => {
    try {
        const students = await Student.findAll({
            attributes: ['class'],
            group: ['class']
        });

        const classes = students.map(s => s.class);
        const stats = [];

        for (const className of classes) {
            const classStudents = await Student.findAll({
                where: {
                    class: className,
                    status: 'Active'
                },
                include: [Grade]
            });

            let classTotalScore = 0;
            let classTotalMax = 0;
            let topper = null;
            let maxPercentage = -1;

            const studentStats = classStudents.map(student => {
                let totalScore = 0;
                let totalMax = 0;
                student.Grades.forEach(g => {
                    totalScore += g.score;
                    totalMax += g.max_score;
                });

                const percentage = totalMax > 0 ? (totalScore / totalMax) * 100 : 0;

                if (percentage > maxPercentage) {
                    maxPercentage = percentage;
                    topper = student;
                }

                classTotalScore += totalScore;
                classTotalMax += totalMax;

                return {
                    id: student.id,
                    name: student.name,
                    percentage
                };
            });

            stats.push({
                className,
                studentCount: classStudents.length,
                averagePercentage: classTotalMax > 0 ? (classTotalScore / classTotalMax) * 100 : 0,
                topper: topper ? { name: topper.name, percentage: maxPercentage } : null
            });
        }

        res.send(stats);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

exports.getClassDetails = async (req, res) => {
    try {
        const { className } = req.params;
        const students = await Student.findAll({
            where: {
                class: className,
                status: 'Active'
            },
            include: [Grade]
        });

        const details = students.map(student => {
            let totalScore = 0;
            let totalMax = 0;
            student.Grades.forEach(g => {
                totalScore += g.score;
                totalMax += g.max_score;
            });
            const percentage = totalMax > 0 ? (totalScore / totalMax) * 100 : 0;

            return {
                id: student.id,
                name: student.name,
                roll_number: student.roll_number,
                percentage: percentage.toFixed(2),
                grades: student.Grades
            };
        });

        // Sort by percentage descending
        details.sort((a, b) => parseFloat(b.percentage) - parseFloat(a.percentage));

        res.send(details);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
}
