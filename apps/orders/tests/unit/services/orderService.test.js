const OrderService = require('../../../services/orderService');
const Order = require('../../../models/Order');
const stripe = require('../../../config/stripeConfig');
const { publishOrderCreated } = require('../../../adapters/events/rabbitmq/producer');  // Assuming the function is imported like this
const amqp = require('amqplib');
const { configConsumer } = require('../../../adapters/events/rabbitmq/consumer'); // Adjust the path to your consumer file

jest.mock('../../../models/Order');
jest.mock('../../../config/stripeConfig');
jest.mock('../../../adapters/events/rabbitmq/producer');
jest.mock('amqplib'); // Mock the amqplib library

describe('OrderService', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear previous mocks before each test
  });

  describe('findAll', () => {
    it('should return all orders', async () => {
      const mockOrders = [
        { _id: 'order1', orderStatus: 'validated' },
        { _id: 'order2', orderStatus: 'processing' },
      ];

      // Mock the Order.find method to resolve with mockOrders
      Order.find.mockResolvedValue(mockOrders);

      const result = await OrderService.findAll();

      // Assert that Order.find was called correctly
      expect(Order.find).toHaveBeenCalledWith({});

      // Assert that the result is as expected
      expect(result).toEqual(mockOrders);
    });

    it('should throw an error if an exception occurs', async () => {
      // Mock the Order.find method to reject with an error
      Order.find.mockRejectedValue(new Error('Database error'));

      await expect(OrderService.findAll()).rejects.toThrow('Internal server error');
    });
  });

  describe('createOrder', () => {
    let orderData, orderSaveMock;
    beforeEach(() => {
      // Mock order data
      orderData = {
        "buyerId": "1",
        "noteId": "1",
        "orderPrice": 2000
      }

      // Mock Order's save method
      orderSaveMock = jest.fn().mockResolvedValue({
        ...orderData,
        stripeTransactionId: "",
        orderStatus: 'created',
        _id: '123456789',
      });

      Order.mockImplementation(() => ({
        save: orderSaveMock
      }));

      publishOrderCreated.mockImplementation(() => {});
    });

    it('should create a new order and return a success status ', async () => {
      const result = await OrderService.createOrder(orderData);
      // Assert that the order was saved correctly
      expect(orderSaveMock).toHaveBeenCalled();
      expect(publishOrderCreated).toHaveBeenCalled(); // Corrected: Do not invoke the function
      expect(result).toEqual({
        status:200
      });

    });

    it('should throw an error if an exception occurs', async () => {
      // Mocking the save method to throw an error
      orderSaveMock.mockRejectedValue(new Error('Database error'));
      await expect(OrderService.createOrder(orderData)).rejects.toThrow('Internal server error');
    });

  });

  describe('findById', () => {
    it('should return the correct order by ID', async () => {
      const orderMock = {
        id: 'order_1',
        "buyerId": "1",
        "noteId": "1",
        "orderPrice": 2000
      };

      Order.findById.mockResolvedValue(orderMock);
      const result = await OrderService.findById('order_1');
      expect(Order.findById).toHaveBeenCalledWith('order_1');
      expect(result).toEqual(orderMock);

    });

    it('should throw an error if order is not found', async () => {
      Order.findById.mockRejectedValue(new Error('Order not found'));
      await expect(OrderService.findById('invalid_order_id'))
        .rejects
        .toThrow('Internal server error');
    });

  });

  describe('update', () => {
    let orderId, updateData;
    beforeEach(() => {
      // Sample order ID and update data
      orderId = '66f18104467889b2731ddfa0';
      updateData = {
        stripeTransactionId: 'pi_3Q2DeEDkLPcWi5RD2JbPPO22',
        orderStatus: 'successful',
        orderPrice: 50000,
      };

      // Mock the findByIdAndUpdate method
      Order.findByIdAndUpdate.mockResolvedValue({
        _id: orderId,
        ...updateData,
      });
    });

    it('should update an order and return the updated order data', async () => {
      const result = await OrderService.update(orderId, updateData);

      // Assert that findByIdAndUpdate was called with the correct parameters
      expect(Order.findByIdAndUpdate).toHaveBeenCalledWith(orderId, updateData, { new: true });

      // Assert that the result matches the expected updated order
      expect(result).toEqual({
        _id: orderId,
        ...updateData,
      });
    });

    it('should throw an error if an exception occurs', async () => {
      // Simulate an error by rejecting the promise
      Order.findByIdAndUpdate.mockRejectedValue(new Error('Database error'));

      await expect(OrderService.update(orderId, updateData)).rejects.toThrow('Internal server error');
    });
  });

  describe('updateOrderStatus', () => {
    const orderId = '66f18104467889b2731ddfa0';
    const status = 'validated';

    it('should update the order status and return the updated order', async () => {
      const mockUpdatedOrder = {
        _id: orderId,
        orderStatus: status,
      };

      // Mock the findOneAndUpdate method to resolve with updated order
      Order.findOneAndUpdate.mockResolvedValue(mockUpdatedOrder);

      const result = await OrderService.updateOrderStatus(orderId, status);

      expect(Order.findOneAndUpdate).toHaveBeenCalledWith(
          { _id: orderId },
          { $set: { orderStatus: status } },
          { new: true }
      );

      expect(result).toEqual({
        status: 200,
        data: mockUpdatedOrder,
      });
    });

    it('should throw an error if an exception occurs', async () => {
      Order.findOneAndUpdate.mockRejectedValue(new Error('Database error'));

      await expect(OrderService.updateOrderStatus(orderId, status)).rejects.toThrow('Internal server error');
    });
  });

  describe('createPaymentIntent', () => {
    const orderData = {
      _id: '66f18104467889b2731ddfa0',
      orderPrice: 10000, // Amount in cents
      customerId: '1'
    };

    it('should create a payment intent and update the order status', async () => {
      const mockClientSecret = 'secret_testClientSecret';

      stripe.paymentIntents.create.mockResolvedValue({
        client_secret: mockClientSecret
      });

      Order.findOneAndUpdate.mockResolvedValue({ ...orderData, orderStatus: 'processing' });

      const result = await OrderService.createPaymentIntent(orderData);

      expect(stripe.paymentIntents.create).toHaveBeenCalledWith({
        amount: orderData.orderPrice,
        currency: 'sgd',
        customer: orderData.customerId,
        payment_method_types: ['card'],
        metadata: {
          orderId: orderData._id,
        },
      });

      expect(Order.findOneAndUpdate).toHaveBeenCalledWith(
          { _id: orderData._id },
          { $set: { orderStatus: 'processing' } },
          { new: true }
      );

      expect(result).toBe(mockClientSecret);
    });

    it('should throw an error if payment intent creation fails', async () => {
      stripe.paymentIntents.create.mockRejectedValue(new Error('Payment intent creation failed'));

      await expect(OrderService.createPaymentIntent(orderData)).rejects.toThrow('Payment intent creation failed');
      expect(Order.findOneAndUpdate).not.toHaveBeenCalled();
    });
  });
});


describe('Consumer Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear previous mock calls
  });

  describe('configConsumer', () => {
    it('should set up the RabbitMQ consumer correctly', async () => {
      // Mock the connection and channel creation
      const mockChannel = {
        assertExchange: jest.fn(),
        assertQueue: jest.fn(),
        bindQueue: jest.fn(),
        consume: jest.fn(),
      };
      amqp.connect.mockResolvedValue({
        createChannel: jest.fn().mockResolvedValue(mockChannel),
      });

      await configConsumer();

      expect(amqp.connect).toHaveBeenCalled();
      expect(mockChannel.assertExchange).toHaveBeenCalledWith('orders', 'topic');
      expect(mockChannel.assertQueue).toHaveBeenCalledWith('notes-found');
      expect(mockChannel.bindQueue).toHaveBeenCalledWith('notes-found', 'orders', 'orders.notes.#');
      expect(mockChannel.consume).toHaveBeenCalledWith('notes-found', expect.any(Function));
      expect(mockChannel.assertQueue).toHaveBeenCalledWith('payment-completed');
      expect(mockChannel.bindQueue).toHaveBeenCalledWith('payment-completed', 'orders', 'orders.payment.#');
      expect(mockChannel.consume).toHaveBeenCalledWith('payment-completed', expect.any(Function));
    });
  });

});



