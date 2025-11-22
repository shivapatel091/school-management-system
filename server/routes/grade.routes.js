const express = require('express');
const router = express.Router();
const controller = require('../controllers/grade.controller');
const { verifyToken, isTeacher } = require('../middleware/authJwt');

router.post('/', [verifyToken, isTeacher], controller.create);
router.get('/student/:studentId', [verifyToken, isTeacher], controller.findAllByStudent);
router.get('/sheet/:studentId', [verifyToken, isTeacher], controller.generateSheet);

module.exports = router;
