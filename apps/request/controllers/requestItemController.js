const RequestItemService = require('../services/requestItemService');

async function getRequestItemById(req, res) {
  try {
    const { requestId } = req.params;
    const requestItem = await RequestItemService.findById(requestId)
    res.status(200).json(requestItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function createRequest(req, res) {
  const userId = "test-user";
  try {
    const requestItem = await RequestItemService.createRequest(userId, req.body);
    res.status(201).json({ message: 'Request created successfully', requestItem });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function getAllRequestItem(req, res) {
  try {
      const requestItems = await RequestItemService.findAll();
      res.status(200).json(requestItems);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
}

async function updateRequestById(req, res) {
  const userId = "test-user";
  const {requestId} = req.params;
  const updateData = req.body;

  try {
    const updatedRequest = await RequestItemService.update(userId, requestId, updateData);
    res.status(200).json({ message: 'Reqeust updated successfully', updatedRequest });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
}

async function deleteRequestById(req, res) {
  try {
    const {requestId} = req.params;
    const requestItem = await RequestItemService.delete(requestId);
    res.status(200).json({ message: 'Request deleted successfully', requestItem });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports = {
  getRequestItemById,
  createRequest,
  getAllRequestItem,
  updateRequestById,
  deleteRequestById,
};