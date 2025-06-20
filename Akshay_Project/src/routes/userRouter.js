const express = require('express');
const { signup, user, users, userDelete } = require('../controllers/userController');
const router = express.Router();

// Body parser middleware to parse JSON request bodies
router.use(express.json());

router.post('/signup', signup);
router.post('/user', user);
router.get('/users', users);
router.delete('/user/:id', userDelete);

module.exports = router;