const express = require('express');
const router = express.Router();
const requestItemController = require('../controllers/requestItemController');

router.get('/:requestId', requestItemController.getRequestItemById);
router.get('/', requestItemController.getAllRequestItem);
router.post('/', requestItemController.createRequest);
router.put('/:requestId', requestItemController.updateRequestById);
router.delete('/:requestId', requestItemController.deleteRequestById);

module.exports = router;
