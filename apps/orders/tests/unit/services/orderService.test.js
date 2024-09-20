const OrderService = require('../../../services/orderService');
const Order = require('../../../models/Order');
const stripe = require('../../../config/stripeConfig');

jest.mock('../../../models/Order');  
jest.mock('../../../config/stripeConfig');  

describe('OrderService', () => {
  
  // Tests createOrder
  describe('createOrder', () => {
    let orderData, stripePaymentIntentMock, orderSaveMock;
    beforeEach(() => {
      // Mock order data and Stripe response
      orderData = {
        noteId: 'note_1',
        buyerEmail: 'testing@gmail.com',
        orderPrice: 15,
        customerId: 'customer_1'
      };

      stripePaymentIntentMock = {
        id: 'pi_123456789',
        status: 'requires_payment_method'
      };

      // Mock the Stripe paymentIntents.create method
      stripe.paymentIntents.create.mockResolvedValue(stripePaymentIntentMock);

      // Mock Order's save method
      orderSaveMock = jest.fn().mockResolvedValue({
        ...orderData, // ...orderData spreads its properties to the new object
        orderId: stripePaymentIntentMock.id,
        stripeTransactionId: stripePaymentIntentMock.id,
        orderStatus: 'Processing'
      });

      Order.mockImplementation(() => ({
        save: orderSaveMock
      }));

    });

    it('should create a new order and return the order data', async () => {
      const result = await OrderService.createOrder(orderData);
      
      // Assert that the paymentIntent was created with the correct data
      expect(stripe.paymentIntents.create).toHaveBeenCalledWith({
        amount: orderData.orderPrice,
        currency: 'sgd',
        customer: orderData.customerId,
        payment_method_types: ['card']
      });

      // Assert that the order was saved correctly
      expect(orderSaveMock).toHaveBeenCalled();
      expect(result).toEqual({
        ...orderData,
        orderId: stripePaymentIntentMock.id,
        stripeTransactionId: stripePaymentIntentMock.id,
        orderStatus: 'Processing'
      });
    });
    
    it('should throw an error if Stripe payment fails', async () => {
      stripe.paymentIntents.create.mockRejectedValue(new Error('Stripe error'));
      await expect(OrderService.createOrder(orderData))
        .rejects
        .toThrow('Internal server error');
    });

  });

  // Tests findById
  describe('findById', () => {

    it('should return the correct order by ID', async () => {
      const orderMock = {
        id: 'order_1',
        noteId: 'noteId_1',
        buyerEmail: 'testing@gmail.com',
        orderPrice: 15
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
});
