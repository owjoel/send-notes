var express = require('express');
const {callback, refreshToken} = require("../controllers/callback");

var router = express.Router();

router.get('/callback', callback);
router.get('/refreshToken', refreshToken);


module.exports = router;
