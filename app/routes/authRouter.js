const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/login', authController.login);
router.post('/refresh', authController.refresh);
router.post('/logout', authController.logout);

router.post('/cookieSample', authController.cookieSample);
router.post('/sessionSample', authController.sessionSample);
router.post('/jwtSample', authController.jwtSample);


module.exports = router