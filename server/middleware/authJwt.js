const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(403).send({ message: 'No token provided.' });

    jwt.verify(token.split(' ')[1], process.env.JWT_SECRET || 'secret_key', (err, decoded) => {
        if (err) return res.status(500).send({ message: 'Failed to authenticate token.' });
        req.userId = decoded.id;
        req.userRole = decoded.role;
        next();
    });
};

const isAdmin = (req, res, next) => {
    if (req.userRole !== 'admin') {
        return res.status(403).send({ message: 'Require Admin Role!' });
    }
    next();
};

const isTeacher = (req, res, next) => {
    if (req.userRole !== 'teacher' && req.userRole !== 'admin') {
        return res.status(403).send({ message: 'Require Teacher Role!' });
    }
    next();
};

module.exports = { verifyToken, isAdmin, isTeacher };
