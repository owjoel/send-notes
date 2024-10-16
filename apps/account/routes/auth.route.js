var express = require('express');
const {callback, refreshToken, authTest, logout, isAuthenticated} = require("../controllers/auth");
const {tokenValid} = require("../../../middlewares/token_verifier/index")

var router = express.Router();

router.get('/test',tokenValid, authTest);
router.get('/callback', callback);
router.get('/refreshToken', refreshToken);
router.get('/logout', logout);
router.get('/', isAuthenticated)
router.get('/access/:accessToken', tokenValid)

module.exports = router;
