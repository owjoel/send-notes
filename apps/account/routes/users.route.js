var express = require('express');
const {getSessionData} = require("../controllers/user");

var router = express.Router();

router.get('/', getSessionData);



module.exports = router;
