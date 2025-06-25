const express = require('express');
const { userAuth } = require('../middleare/auth');
const { send, review } = require('../controllers/requestController');


const router = express.Router();

router.post('/send/:status/:toUserId', userAuth, send);
router.post('/review/:status/:requestId', userAuth, review); // Assuming you want to review requests

module.exports = router;