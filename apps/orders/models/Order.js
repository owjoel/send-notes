const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  stripeTransactionId: {
    type: String,
    required: true,
    trim: true,
    unique:true
  },
  noteId: {  
    type: String,
    required: true,
    trim: true,
  },
  buyerId: {
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
