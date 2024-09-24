var express = require('express');
const {callback, refreshToken, authTest} = require("../controllers/callback");

var router = express.Router();

router.get('/callback', callback);
router.get('/refreshToken', refreshToken);
router.get('/test', authTest);


module.exports = router;
