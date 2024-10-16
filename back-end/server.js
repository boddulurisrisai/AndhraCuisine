// server.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios'); // For making HTTP requests to OpenAI

const app = express();

// Load environment variables
dotenv.config();

// Middleware to parse JSON requests
app.use(bodyParser.json());

// MongoDB connection string from .env
const DB_URI = process.env.DB_URI || 'mongodb://localhost:27017/foodservice';
const OPENAI_API_KEY = 'sk-proj-7_I®lLwk-tGvxWDP6f1DQes@¡f¡JoX00-CNVawnojG54mf82MIWDTEndy_Br40sja_M]5HCYyaBT3B1bkFJ15dWMKsgwokMoEfMAW-_squNnTd5JXDs8GfQMiucm6-DjUqgdZXXzUFR9j2ntjpM-qweFIgDQA';
// Connect to MongoDB
mongoose.connect(DB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

// Test route to check MongoDB connection
app.get('/test', async (req, res) => {
  try {
    const result = await mongoose.connection.db.collection('foodItems').findOne({});
    res.status(200).json({ message: 'MongoDB is connected!', data: result });
  } catch (error) {
    res.status(500).json({ message: 'Error connecting to MongoDB', error });
  }
});

// Route to handle chat messages
app.post('/api/chat/message', async (req, res) => {
  const userMessage = req.body.message;

  try {
    // Call OpenAI's API
    const openAiResponse = await axios.post(
      `https://api.openai.com/v1/chat/completions`,
      {
        model: "gpt-3.5-turbo", // Use the desired OpenAI model
        messages: [{ role: "user", content: userMessage }],
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const assistantResponse = openAiResponse.data.choices[0].message.content;

    // Perform a simple search in the database based on the assistant's response
    const recommendedProduct = await mongoose.connection.db.collection('foodItems').findOne({
      name: { $regex: new RegExp(assistantResponse, 'i') }
    });

    res.status(200).json({ text: assistantResponse, product: recommendedProduct });
  } catch (error) {
    console.error('Error processing chat message:', error);
    res.status(500).json({ message: 'Error processing message', error });
  }
});

// Route to handle purchases (add your implementation)
app.post('/api/chat/purchase', async (req, res) => {
  // Handle purchase logic here
  const { name, address, paymentInfo, productId } = req.body;
  // Example response for the sake of the demo
  res.status(200).json({ orderNumber: Math.floor(Math.random() * 10000) });
});

// Start the server
const PORT = process.env.PORT || 3030;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
