// routes/chatRoutes.js

const express = require('express');
const router = express.Router();

// Mocked product recommendations (In practice, this could be from a database or AI model)
const products = [
  { id: 1, name: 'Smart Doorlock', price: 199.99 },
  { id: 2, name: 'Smart Speaker', price: 99.99 },
  { id: 3, name: 'Smart Thermostat', price: 149.99 },
];

// Handle incoming messages and return recommendations
router.post('/message', (req, res) => {
  const userMessage = req.body.message;

  // Simple mock AI logic to decide a recommendation
  let recommendedProduct;
  if (userMessage.includes('lock')) {
    recommendedProduct = products[0]; // Smart Doorlock
  } else if (userMessage.includes('speaker')) {
    recommendedProduct = products[1]; // Smart Speaker
  } else {
    recommendedProduct = products[2]; // Smart Thermostat
  }

  res.json({ text: `We recommend: ${recommendedProduct.name} for $${recommendedProduct.price}`, product: recommendedProduct });
});

// Endpoint to handle purchases
router.post('/purchase', (req, res) => {
  const { name, address, paymentInfo, productId } = req.body;

  // Simulate a successful transaction and generate an order number
  const orderNumber = Math.floor(Math.random() * 100000);
  res.json({ message: 'Purchase successful!', orderNumber, productId });
});

module.exports = router;
