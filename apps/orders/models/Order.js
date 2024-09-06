const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderId: {  
    type: String,
    required: true,
    trim: true
  },
  stripeTransactionId: {
    type: String,
    required: true,
    trim: true
  },
  noteId: {  
    type: String,
    required: true,
    trim: true,
  },
  buyerEmail: {  
    type: String,
    required: true,
    trim: true,
  },
  orderStatus: {  
    type: String,
    required: true,
    trim: true
  },
  orderPrice: {  
    type: Number,
    required: true
  }
});

module.exports = mongoose.model('Order', orderSchema);
