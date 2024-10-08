var express = require('express');
const {callback, refreshToken, authTest, logout, isAuthenticated} = require("../controllers/auth");

var router = express.Router();

router.get('/callback', callback);
router.get('/refreshToken', refreshToken);
router.get('/test', authTest);
router.get('/logout', logout);
router.get('/', isAuthenticated)

module.exports = router;
