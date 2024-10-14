var express = require('express');
const {callback, refreshToken, authTest, logout, isAuthenticated, tokenValid} = require("../controllers/auth");

var router = express.Router();

router.get('/callback', callback);
router.get('/refreshToken', refreshToken);
router.get('/test', authTest);
router.get('/logout', logout);
router.get('/', isAuthenticated)
router.get('/access/:accessToken', tokenValid)

module.exports = router;
