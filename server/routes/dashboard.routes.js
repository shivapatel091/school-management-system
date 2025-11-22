const express = require('express');
const router = express.Router();
const controller = require('../controllers/dashboard.controller');
const authJwt = require('../middleware/authJwt');

router.get('/stats', [authJwt.verifyToken], controller.getStats);
router.get('/defaulted', [authJwt.verifyToken, authJwt.isAdmin], controller.getDefaultedFees);

module.exports = router;
