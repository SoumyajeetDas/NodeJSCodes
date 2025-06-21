const express = require('express');
const { signup, user, users, userDelete, updateUser, login } = require('../controllers/userController');
const router = express.Router();

// Body parser middleware to parse JSON request bodies
router.use(express.json());

router.post('/signup', signup);
router.post('/login', login);
router.post('/user', user);
router.get('/users', users);
router.route('/user/:id')
  .get(userDelete) // Assuming you want to get a user by ID;
  .patch(updateUser); // Assuming you want to update a user by ID


module.exports = router;