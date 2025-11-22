const Student = require('../models/Student');

exports.create = async (req, res) => {
    try {
        const student = await Student.create(req.body);
        res.send(student);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

exports.findAll = async (req, res) => {
    try {
        const students = await Student.findAll();
        res.send(students);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

exports.findOne = async (req, res) => {
    try {
        const student = await Student.findByPk(req.params.id);
        if (!student) return res.status(404).send({ message: "Student not found" });
        res.send(student);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

exports.update = async (req, res) => {
    try {
        const num = await Student.update(req.body, { where: { id: req.params.id } });
        if (num == 1) {
            res.send({ message: "Student was updated successfully." });
        } else {
            res.send({ message: `Cannot update Student with id=${req.params.id}. Maybe Student was not found or req.body is empty!` });
        }
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

exports.delete = async (req, res) => {
    try {
        const num = await Student.destroy({ where: { id: req.params.id } });
        if (num == 1) {
            res.send({ message: "Student was deleted successfully!" });
        } else {
            res.send({ message: `Cannot delete Student with id=${req.params.id}. Maybe Student was not found!` });
        }
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};
