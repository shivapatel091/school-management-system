const TeacherAssignment = require('../models/TeacherAssignment');
const User = require('../models/User');

// Get all classes assigned to a teacher
exports.getMyClasses = async (req, res) => {
    try {
        const assignments = await TeacherAssignment.findAll({
            where: { user_id: req.userId },
            attributes: ['class_name', 'subject']
        });

        // Group by class_name
        const classesMap = {};
        assignments.forEach(assignment => {
            if (!classesMap[assignment.class_name]) {
                classesMap[assignment.class_name] = [];
            }
            classesMap[assignment.class_name].push(assignment.subject);
        });

        const classes = Object.keys(classesMap).map(className => ({
            class_name: className,
            subjects: classesMap[className]
        }));

        res.send(classes);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

// Get all teacher assignments (admin only)
exports.getAllAssignments = async (req, res) => {
    try {
        const assignments = await TeacherAssignment.findAll({
            include: [{
                model: User,
                attributes: ['id', 'username', 'role']
            }]
        });
        res.send(assignments);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

// Assign teacher to class (admin only)
exports.assignTeacher = async (req, res) => {
    try {
        const { user_id, class_name, subject } = req.body;

        // Check if assignment already exists
        const existing = await TeacherAssignment.findOne({
            where: { user_id, class_name, subject }
        });

        if (existing) {
            return res.status(400).send({ message: 'This assignment already exists.' });
        }

        const assignment = await TeacherAssignment.create({
            user_id,
            class_name,
            subject
        });

        res.send(assignment);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

// Remove teacher assignment (admin only)
exports.removeAssignment = async (req, res) => {
    try {
        const { id } = req.params;
        await TeacherAssignment.destroy({ where: { id } });
        res.send({ message: 'Assignment removed successfully.' });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};
