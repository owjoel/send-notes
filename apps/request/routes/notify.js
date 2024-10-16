const express = require('express');
const router = express.Router();
const requestItemController = require('../controllers/requestItemController');


router.get('/:tag', requestItemController.notifyRequest);

module.exports = router;
