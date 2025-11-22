const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

exports.signin = async (req, res) => {
    try {
        const user = await User.findOne({
            where: {
                username: req.body.username
            }
        });

        if (!user) {
            return res.status(404).send({ message: "User Not found." });
        }

        const passwordIsValid = bcrypt.compareSync(
            req.body.password,
            user.password
        );

        if (!passwordIsValid) {
            return res.status(401).send({
                accessToken: null,
                message: "Invalid Password!"
            });
        }

        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET || 'secret_key', {
            expiresIn: 86400 // 24 hours
        });

        res.status(200).send({
            id: user.id,
            username: user.username,
            role: user.role,
            accessToken: token
        });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

exports.seed = async (req, res) => {
    // Initial seed for admin and teacher
    try {
        const adminExists = await User.findOne({ where: { username: 'admin' } });
        if (!adminExists) {
            await User.create({
                username: 'admin',
                password: bcrypt.hashSync('admin123', 8),
                role: 'admin',
                name: 'Admin User'
            });
        }

        const teacherExists = await User.findOne({ where: { username: 'teacher' } });
        if (!teacherExists) {
            await User.create({
                username: 'teacher',
                password: bcrypt.hashSync('teacher123', 8),
                role: 'teacher',
                name: 'Teacher User'
            });
        }
        res.send({ message: "Seeding done" });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

exports.register = async (req, res) => {
    try {
        const { username, password, role, name, email, phone, employee_id, specialization } = req.body;

        const userExists = await User.findOne({ where: { username } });
        if (userExists) {
            return res.status(400).send({ message: "Username already exists!" });
        }

        const user = await User.create({
            username,
            password: bcrypt.hashSync(password, 8),
            role: role || 'teacher',
            name,
            email,
            phone,
            employee_id,
            specialization
        });

        res.send({
            message: "User registered successfully!",
            user: {
                id: user.id,
                username: user.username,
                role: user.role,
                name: user.name,
                email: user.email,
                specialization: user.specialization
            }
        });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: ['id', 'username', 'role', 'name', 'email', 'phone', 'employee_id', 'specialization']
        });
        res.send(users);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};
