const express = require('express');
const router = express.Router();
const controller = require('../controllers/class.controller');
const { verifyToken, isAdmin, isTeacher } = require('../middleware/authJwt');

// Allow both admin and teacher to view class stats
router.get('/stats', [verifyToken], controller.getClassStats);
router.get('/:className', [verifyToken], controller.getClassDetails);

module.exports = router;
