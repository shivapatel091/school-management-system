const router = require('express').Router();
const controller = require('../controllers/schedule.controller');
const authJwt = require('../middleware/authJwt');

// Teacher routes
router.get('/my-schedule', [authJwt.verifyToken, authJwt.isTeacher], controller.getMySchedule);
router.get('/today', [authJwt.verifyToken, authJwt.isTeacher], controller.getTodaySchedule);

// Admin routes
router.get('/all', [authJwt.verifyToken, authJwt.isAdmin], controller.getAllSchedules);
router.post('/', [authJwt.verifyToken, authJwt.isAdmin], controller.createSchedule);
router.put('/:id', [authJwt.verifyToken, authJwt.isAdmin], controller.updateSchedule);
router.delete('/:id', [authJwt.verifyToken, authJwt.isAdmin], controller.deleteSchedule);

module.exports = router;
