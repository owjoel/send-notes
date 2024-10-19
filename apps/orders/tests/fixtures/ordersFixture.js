const mongoose = require('mongoose');
const Order = require('../../models/Order'); 

const ordersFixture = [
  {
    _id: '67120c6f7ea8b360d4254f26',
    stripeTransactionId: 'pi_3JrD2r2eZvKYlo2C1ZKwiKm9',
    noteId: '1',
    buyerId: '1',
    orderStatus: 'created',
    orderPrice: 50000,
  },
  {
    _id: '671211057ea8b360d4254f3a',
    stripeTransactionId: 'pi_3JrD2w8eZvKYlo2C1ZKwiY3Z',
    noteId: '1',
    buyerId: '1',
    orderStatus: 'created',
    orderPrice: 50000,
  },
];

// Fixture to setup the database state for integration tests
async function setupDatabase() {
  await mongoose.connect('mongodb://testuser:testpassword@mongo:27017/orderstest_db', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  // Drop existing orders collection
  await Order.deleteMany({});

  // Create orders collection and insert fixture data
  await Order.insertMany(ordersFixture);
}

module.exports = {
  setupDatabase,
};
