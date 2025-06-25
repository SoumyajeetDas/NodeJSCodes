const express = require('express');
const { userAuth } = require('../middleare/auth');
const { requestsReceived, connections } = require('../controllers/userController');

const router = express.Router();

router.get('/request/received', userAuth, requestsReceived);
router.get('/request/connections', userAuth, connections);

module.exports = router;