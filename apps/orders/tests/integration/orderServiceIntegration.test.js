const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../app'); 
const Order = require('../../models/Order'); 
const ordersFixture = require('../fixtures/ordersFixture');
const connectDB = require('../../config/db');


jest.setTimeout(100000);

describe('Order API Integration Tests', () => {

  beforeAll(async () => {
    // process.env.NODE_ENV = 'test';
    console.log(`Connecting to MongoDB URI: ${process.env.MONGODB_URI}`);
    // await new Promise(resolve => setTimeout(resolve, 70000));
    await connectDB();
    console.log('Connected to MongoDB');
    
    await Order.deleteMany({});
    await Order.insertMany(ordersFixture);
    orderIdToDelete = ordersFixture[0]._id;
  });

  afterAll(async () => {
    // Drop the test database and close the connection
    await mongoose.connection.db.dropDatabase();
    await mongoose.connection.close();
  });

  it('should fetch all orders', async () => {
    const response = await request(app).get('/orders'); 
    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(2);  // 2 orders in fixture
  });

  it('should fetch a specific order by ID', async () => {
    const orderId = ordersFixture[0]._id;
    const response = await request(app).get(`/orders/${orderId}`); 
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('_id', orderId);
    expect(response.body).toHaveProperty('orderPrice', ordersFixture[0].orderPrice);
  });

  it('should return 404 if the order does not exist', async () => {
    const nonExistentId = new mongoose.Types.ObjectId();
    const response = await request(app).get(`/orders/${nonExistentId}`);
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('message', 'Order not found');
  });

  it('should create a new order', async () => {
    const newOrder = {
      stripeTransactionId: 'pi_12345r2eZvKYlo2C1ZKwiKm9',
      noteId: '10',          
      buyerId: '10',           
      orderStatus: 'created',  
      orderPrice: 50000        
    };

    const response = await request(app).post('/orders').send(newOrder); 

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('_id');
    expect(response.body.buyerId).toBe(newOrder.buyerId);
    expect(response.body.orderPrice).toBe(newOrder.orderPrice);

    const createdOrder = await Order.findById(response.body._id);
    expect(createdOrder).toBeTruthy(); //TRUTHYYYYYYYY
  });

  it('should update an order by ID', async () => {
    const updatedData = {
      orderStatus: 'completed',
    };
    const orderId = ordersFixture[0]._id;

    const response = await request(app).put(`/orders/${orderId}`).send(updatedData); 
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('orderStatus', 'completed');

    const updatedOrder = await Order.findById(orderId);
    expect(updatedOrder.orderStatus).toBe('completed');
  });

  it('should return 404 when updating a non-existent order', async () => {
    const nonExistentId = new mongoose.Types.ObjectId();
    const updatedData = { orderStatus: 'shipped' };

    const response = await request(app).put(`/orders/${nonExistentId}`).send(updatedData);
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('message', 'Order not found');
  });

  it('should delete an order by ID', async () => {
    const response = await request(app).delete(`/orders/${orderIdToDelete}`); 
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('deletedCount', 1);

    const deletedOrder = await Order.findById(orderIdToDelete);
    expect(deletedOrder).toBeNull();
  });

  it('should return 404 when deleting a non-existent order', async () => {
    const nonExistentId = new mongoose.Types.ObjectId();

    const response = await request(app).delete(`/orders/${nonExistentId}`);
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('message', 'Order not found');
  });
});