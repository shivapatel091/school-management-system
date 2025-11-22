const express = require('express');
const router = require('express').Router();
const controller = require('../controllers/auth.controller');
const authJwt = require('../middleware/authJwt');

router.post('/login', controller.signin);
router.post('/seed', controller.seed);
router.post('/register', [authJwt.verifyToken, authJwt.isAdmin], controller.register);
router.get('/users', [authJwt.verifyToken, authJwt.isAdmin], controller.getAllUsers);

module.exports = router;
