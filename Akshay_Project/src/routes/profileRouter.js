const express = require('express');
const { userAuth } = require('../middleare/auth');
const { profileView, profileEdit } = require('../controllers/profileController');


const router = express.Router();

router.get('/view', [userAuth, profileView]); // Want to get the profile of the logged-in user

router.patch('/edit', [userAuth, profileEdit]); // Want to edit the profile of the logged-in user


module.exports = router;