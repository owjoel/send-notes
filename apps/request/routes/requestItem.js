const express = require('express');
const router = express.Router();
const requestItemController = require('../controllers/requestItemController');
const {tokenValid} = require('token-verifier-mee-rebus');

router.get('/:requestId',tokenValid, requestItemController.getRequestItemById);
router.get('/', requestItemController.getAllRequestItem);
router.post('/', requestItemController.createRequest);
router.put('/:requestId', requestItemController.updateRequestById);
router.delete('/:requestId', requestItemController.deleteRequestById);

module.exports = router;
