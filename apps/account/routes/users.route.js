var express = require('express');
const {getSessionData, getUser} = require("../controllers/user");

var router = express.Router();

router.get('/', getSessionData);
router.get('/:id',getUser)



module.exports = router;
