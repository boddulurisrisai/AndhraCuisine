import dotenv from 'dotenv'; // Use import instead of require
import express from 'express'; // Use import instead of require
import bodyParser from 'body-parser'; // Use import instead of require
import mongoose from 'mongoose'; // Use import instead of require
import axios from 'axios'; // Use import instead of require

dotenv.config();

import { makeOpenAIRequest } from './services/openaiService.js';

const app = express();
const port = 3030;

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Connect to MongoDB using the URI from environment variables
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/foodservice'; // Fallback to default URI

mongoose.connect('mongoUri');

// Define a POST route for food recommendations
// Define a POST route for food recommendations
app.post("/api/chat/recommendation", async (req, res) => {
  const userMessage = req.body.message;

  // Ensure the user message is present
  if (!userMessage) {
      return res.status(400).json({ error: "No message provided" });
  }

  try {
      // Fetch products from MongoDB
      const products = await Product.find();

      // Prepare the prompt for OpenAI
      const productList = products.map(product => `${product.name}: ${product.description}`).join("\n");
      const prompt = `Based on the following products:\n${productList}\n\nUser asked for: ${userMessage}\n\nPlease recommend some products.`;

      // Make a request to the OpenAI API using the utility function
      const response = await makeOpenAIRequest({
          model: "gpt-3.5-turbo", // Use your desired model
          messages: [{ role: "user", content: prompt }],
      });

      // Extract the assistant's response
      const assistantMessage = response.choices[0].message.content;

      // Send the assistant's response back to the client
      res.json({ text: assistantMessage });
  } catch (error) {
      console.error("Error with OpenAI API:", error);
      // Handle error and send a response
      res.status(500).json({ error: "Failed to fetch response from OpenAI" });
  }
});

// Start the Express server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
