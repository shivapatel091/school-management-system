const router = require('express').Router();
const controller = require('../controllers/teacherAssignment.controller');
const authJwt = require('../middleware/authJwt');

// Teacher routes
router.get('/my-classes', [authJwt.verifyToken, authJwt.isTeacher], controller.getMyClasses);

// Admin routes
router.get('/all', [authJwt.verifyToken, authJwt.isAdmin], controller.getAllAssignments);
router.post('/', [authJwt.verifyToken, authJwt.isAdmin], controller.assignTeacher);
router.delete('/:id', [authJwt.verifyToken, authJwt.isAdmin], controller.removeAssignment);

module.exports = router;
