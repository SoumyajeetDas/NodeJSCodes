const express = require('express');
const { signup, login, logout, resetPassword } = require('../controllers/authController');

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/logout', logout);
router.post('/resetpassword', resetPassword);

module.exports = router;