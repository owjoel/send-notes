const OrderService = require('../../../services/orderService');
const Order = require('../../../models/Order');
const stripe = require('../../../config/stripeConfig');
const { publishOrderCreated } = require('../../../adapters/events/rabbitmq/producer');  // Assuming the function is imported like this
const amqp = require('amqplib');
const { configConsumer , handleNotesEvent} = require('../../../adapters/events/rabbitmq/consumer'); // Adjust the path to your consumer file
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
      // Mock the order data
      orderData = {
        buyerId: "1",
        noteId: "1",
        orderPrice: 2000,
      };

      // Mock the Order's save method to resolve with the order data
      orderSaveMock = jest.fn().mockResolvedValue({
        ...orderData,
        stripeTransactionId: "",
        orderStatus: 'created',
        _id: '123456789', // Mock order ID
      });

      // Mock the Order class constructor
      Order.mockImplementation(() => ({
        save: orderSaveMock, // Mock the save method
      }));

      // Mock the publishOrderCreated function
      publishOrderCreated.mockImplementation(jest.fn());
    });

    it('should create a new order, save it, publish the event, and return a success status', async () => {
      const result = await OrderService.createOrder(orderData);

      // Assert that save was called
      expect(orderSaveMock).toHaveBeenCalled();

      // Assert that publishOrderCreated was called with the correct arguments
      // expect(publishOrderCreated).toHaveBeenCalledWith('123456789', {
      //   ...orderData,
      //   stripeTransactionId: "",
      //   orderStatus: 'created',
      //   _id: '123456789',
      // });

      // Assert that the returned result is as expected
      expect(result).toEqual({
        status: 200,
      });
    });

    it('should throw an error if order creation fails', async () => {
      // Mock an error in order.save()
      orderSaveMock.mockRejectedValueOnce(new Error('Save failed'));

      await expect(OrderService.createOrder(orderData)).rejects.toThrow('Internal server error');

      // Ensure publishOrderCreated is not called if the save fails
      expect(publishOrderCreated).not.toHaveBeenCalled();
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

  describe('OrderService.createPaymentIntent', () => {
    let orderData;
    let paymentIntentMock;

    beforeEach(() => {
      // Mock order data
      orderData = {
        _id: '123456789',
        orderPrice: 2000,
        customerId: 'customer_123', // Add a customer ID for the test
      };

      // Mock the Order.findById method
      Order.findById.mockResolvedValue(orderData);

      // Mock the Stripe payment intent creation
      paymentIntentMock = {
        client_secret: 'client_secret_test',
      };
      stripe.paymentIntents.create.mockResolvedValue(paymentIntentMock);

      // Mock the Order.findOneAndUpdate method
      Order.findOneAndUpdate.mockResolvedValue(orderData);
    });

    afterEach(() => {
      jest.clearAllMocks(); // Clear mocks between tests
    });

    it('should create a payment intent and update the order status', async () => {
      const clientSecret = await OrderService.createPaymentIntent('123456789');

      // Assert that the order was found
      expect(Order.findById).toHaveBeenCalledWith('123456789');

      // Assert that the payment intent was created
      expect(stripe.paymentIntents.create).toHaveBeenCalledWith({
        amount: orderData.orderPrice,
        currency: 'sgd',
        customer: orderData.customerId,
        payment_method_types: ['card'],
        metadata: {
          orderId: `${orderData._id}`,
        },
      });

      // Assert that the order status was updated
      expect(Order.findOneAndUpdate).toHaveBeenCalledWith(
          { _id: orderData._id },
          { $set: { orderStatus: 'processing' } },
          { new: true }
      );

      // Assert that the correct client secret was returned
      expect(clientSecret).toBe(paymentIntentMock.client_secret);
    });

    it('should throw an error if the order is not found', async () => {
      Order.findById.mockResolvedValueOnce(null); // Simulate order not found

      await expect(OrderService.createPaymentIntent('invalid_order_id')).rejects.toThrow();
    });

    it('should throw an error if payment intent creation fails', async () => {
      stripe.paymentIntents.create.mockRejectedValueOnce(new Error('Payment Intent Creation Failed'));

      await expect(OrderService.createPaymentIntent('123456789')).rejects.toThrow('Payment Intent Creation Failed');
    });
  });
});


describe('Consumer Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear previous mock calls
  });

  describe('configConsumer', () => {
    let mockChannel;
    let mockConnection;
    let notesFoundQ = 'notes-found';
    beforeEach(() => {
      // Create a mock channel
      mockChannel = {
        assertExchange: jest.fn(),
        assertQueue: jest.fn(),
        bindQueue: jest.fn(),
        consume: jest.fn(),
      };

      // Create a mock connection
      mockConnection = {
        createChannel: jest.fn().mockResolvedValue(mockChannel),
      };

      // Mock the amqp.connect method
      amqp.connect.mockResolvedValue(mockConnection);
    });

    afterEach(() => {
      jest.clearAllMocks(); // Clear mocks between tests
    });

    it('should connect to RabbitMQ and configure the consumer correctly', async () => {
      // Call the configConsumer function
      await configConsumer();

      // Assertions
      expect(amqp.connect).toHaveBeenCalledWith({
        protocol: process.env.RABBITMQ_PROTOCOL,
        username: process.env.RABBITMQ_USER,
        password: process.env.RABBITMQ_PASSWORD,
        hostname: process.env.RABBITMQ_HOST,
        port: process.env.RABBITMQ_PORT,
      });

      expect(mockConnection.createChannel).toHaveBeenCalled();
      expect(mockChannel.assertExchange).toHaveBeenCalledWith('orders', 'topic');
      expect(mockChannel.assertQueue).toHaveBeenCalledWith(notesFoundQ);
      expect(mockChannel.bindQueue).toHaveBeenCalledWith(notesFoundQ, 'orders', 'orders.notes.#');
      expect(mockChannel.consume).toHaveBeenCalledWith(notesFoundQ, expect.any(Function));});
  });
});



