import { v4 as uuidv4 } from 'uuid';
import stripe from 'stripe';
import Order from './../models/order.js';

const stripeClient = stripe(
  'sk_test_51ILMiwDb07U3tJmLa5KdbkcOkbkHqGzCVKeFn1LCyhmlvzb79aJnO4On1wDc1JIAIHi4yyQGhcSpGcuFpbbAkv8m004RdtQZGS'
);

export const placeOrder = async (req, res) => {
  const { token, cartItems, currUser, amount } = req.body;

  try {
    const customer = await stripeClient.customers.create({
      email: token.email,
      source: token.id,
    });
    const payment = await stripeClient.charges.create(
      {
        amount: amount * 100,
        currency: 'INR',
        customer: customer.id,
        receipt_email: token.email,
      },
      { idempotencyKey: uuidv4() }
    );

    if (payment) {
      const newOrder = new Order({
        userId: currUser._id,
        name: currUser.name,
        email: token.email,
        orderedItems: [...cartItems],
        shippingAddress: {
          address: token.card.address_line1,
          city: token.card.address_city,
          postalCode: token.card.address_zip,
          country: token.card.address_country,
        },
        orderAmount: amount,
        transactionId: payment.source.id,
        isDelivered: false,
      });
      const orderDetails = await newOrder.save();
      res.status(200).send(orderDetails);
    } else {
      res.status(400).send('Payment Failed');
    }
  } catch (error) {
    res.status(500).send('Internal Server. Please try after some time');
  }
};

export const getOrdersByUserId = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.query.userId });
    res.status(200).send(orders);
  } catch (error) {
    res.status(500).send('Internal Server Error. !!');
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const allOrders = await Order.find();
    res.send(allOrders);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error !!');
  }
};
