const express = require('express');
const { signup, user, users, userDelete, updateUser, login, profile } = require('../controllers/userController');
const router = express.Router();
const cookieParser = require('cookie-parser');
const { userAuth } = require('../middleare/auth');

// Body parser middleware to parse JSON request bodies
router.use(express.json());
// Cookie parser middleware to parse cookies
router.use(cookieParser());

router.post('/signup', signup);
router.post('/login', login);
router.post('/user', user);
router.get('/profile', [userAuth, profile]); // Want to get the profile of the logged-in user
router.get('/users', users);
router.route('/user/:id')
  .get(userDelete) // Assuming you want to get a user by ID;
  .patch(updateUser); // Assuming you want to update a user by ID


module.exports = router;