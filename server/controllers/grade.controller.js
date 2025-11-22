const Grade = require('../models/Grade');
const Student = require('../models/Student');

exports.create = async (req, res) => {
    try {
        const grade = await Grade.create(req.body);
        res.send(grade);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

exports.findAllByStudent = async (req, res) => {
    try {
        const grades = await Grade.findAll({ where: { student_id: req.params.studentId } });
        res.send(grades);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

exports.generateSheet = async (req, res) => {
    // Simple grade sheet generation logic
    try {
        const student = await Student.findByPk(req.params.studentId, {
            include: [Grade]
        });
        if (!student) return res.status(404).send({ message: "Student not found" });

        // Calculate GPA or total
        let totalScore = 0;
        let totalMax = 0;
        student.Grades.forEach(g => {
            totalScore += g.score;
            totalMax += g.max_score;
        });

        const percentage = totalMax > 0 ? (totalScore / totalMax) * 100 : 0;

        res.send({
            student: student.name,
            roll_number: student.roll_number,
            grades: student.Grades,
            totalScore,
            totalMax,
            percentage: percentage.toFixed(2) + '%'
        });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
}
