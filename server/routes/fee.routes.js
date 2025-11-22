const express = require('express');
const router = express.Router();
const controller = require('../controllers/fee.controller');
const { verifyToken, isAdmin } = require('../middleware/authJwt');

router.post('/', [verifyToken, isAdmin], controller.assignFee);
router.get('/student/:studentId', [verifyToken, isAdmin], controller.getStudentFees);
router.post('/pay', [verifyToken, isAdmin], controller.payFee);

module.exports = router;
