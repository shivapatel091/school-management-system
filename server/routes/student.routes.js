const express = require('express');
const router = express.Router();
const controller = require('../controllers/student.controller');
const { verifyToken, isAdmin, isTeacher } = require('../middleware/authJwt');

router.post('/', [verifyToken, isAdmin], controller.create);
router.get('/', [verifyToken, isTeacher], controller.findAll); // Teachers can view students
router.get('/:id', [verifyToken, isTeacher], controller.findOne);
router.put('/:id', [verifyToken, isAdmin], controller.update);
router.delete('/:id', [verifyToken, isAdmin], controller.delete);

module.exports = router;
