import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import axios from 'axios';
import cors from 'cors';
import { makeOpenAIRequest } from './services/openaiService.js'; // Import OpenAI utility function

// Load environment variables from .env file
dotenv.config();
if (!process.env.OPENAI_API_KEY) {
    console.error("OpenAI API Key is missing. Please add it to your .env file.");
    process.exit(1); // Exit if API key is missing
}
console.log("Your OpenAI API Key:", process.env.OPENAI_API_KEY);

const app = express();
const port = process.env.PORT || 3030; // Default port if not specified

// Use CORS middleware to allow requests from specific origins
app.use(cors({
    origin: 'http://localhost:3000' // Allow requests from this origin
}));

// Middleware to parse JSON bodies
app.use(express.json());

// MongoDB URI from environment variables, fallback to local MongoDB instance if not provided
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/Foodservices';

// Connect to MongoDB using async/await
(async () => {
    try {
        await mongoose.connect(mongoUri); // No need for useNewUrlParser or useUnifiedTopology in Mongoose 6+
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1); // Exit the process if MongoDB connection fails
    }
})();

// Define schema and model for food items
const itemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    imageUrl: {
        type: String,
        validate: {
            validator: (v) => v == null || /^https?:\/\/.*$/.test(v), // Validate URL format if provided
            message: 'Invalid URL format'
        }
    }
});

const Item = mongoose.model('Item', itemSchema, 'Fooditems'); // 'Fooditems' is the exact collection name


// POST route for food recommendations
app.post("/api/chat/recommendation", async (req, res) => {
    console.log("Received a request to /api/chat/recommendation");

    const userMessage = req.body.message;

    // Ensure the user message is present
    if (!userMessage) {
        return res.status(400).json({ error: "No message provided" });
    }

    try {
        console.log("Fetching products from MongoDB...");
        const products = await Item.find();
        console.log("Products fetched:", products); // Log products

        if (products.length === 0) {
            return res.status(404).json({ error: "No products found" });
        }

        // Prepare a list of products for the OpenAI prompt
        const productList = products.map(product => `${product.name}: ${product.description}`).join("\n");

        // Prepare the prompt for OpenAI
        const prompt = `Here are some available food items:\n${productList}\n\nThe user asked: "${userMessage}". Please provide a food recommendation based on these products.`;

        // Make a request to the OpenAI API using the utility function
        const response = await makeOpenAIRequest({
            model: "gpt-3.5-turbo", // Specify your desired OpenAI model
            messages: [{ role: "user", content: prompt }],
        });

        // Extract the assistant's response
        const assistantMessage = response.choices[0].message.content;

        // Send the assistant's response and fetched products back to the client in JSON format
        res.json({
            recommendation: assistantMessage,
            products: products // Products fetched from MongoDB
        });
    } catch (error) {
        console.error("Error with OpenAI API or MongoDB:", error);

        // Check if the error is related to quota
        if (error.response && error.response.status === 429) {
            res.status(429).json({ error: "You have exceeded your quota or hit the rate limit. Please check your OpenAI account." });
        } else {
            res.status(500).json({ error: "Failed to fetch response from OpenAI or MongoDB" });
        }
    }
});



// GET route to fetch all items from the MongoDB collection (Fooditems)
app.get('/api/test/items', async (req, res) => {
    try {
        console.log("Request received to fetch all items");

        // Fetch all products from the Fooditems collection
        const products = await Item.find();

        // Log the results
        if (products.length === 0) {
            console.log("No products found in the Fooditems collection");
            return res.status(404).json({ message: "No products found" });
        }

        console.log(`Fetched ${products.length} product(s) from MongoDB`);
        res.json(products); // Send the products as JSON response
    } catch (error) {
        // Log error details to understand what went wrong
        console.error("Error fetching products from MongoDB:", error.message);
        console.error("Stack Trace:", error.stack);

        // Return a 500 status with error message
        res.status(500).json({ message: "Failed to fetch products" });
    }
});

// Minimal API to call OpenAI
app.post('/api/chat/simple', async (req, res) => {
    const userMessage = req.body.message;

    // Check if the user provided a message
    if (!userMessage) {
        return res.status(400).json({ error: "No message provided" });
    }

    try {
        // Make the request to the OpenAI API
        const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: 'gpt-3.5-turbo', // Use the free-tier friendly model
                messages: [{ role: 'user', content: userMessage }],
                max_tokens: 50, // Limit the response to 50 tokens to save on cost
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
                },
            }
        );

        // Extract and send the response back
        const assistantMessage = response.data.choices[0].message.content;
        res.json({ text: assistantMessage });
    } catch (error) {
        console.error('Error with OpenAI API:', error.message);
        if (error.response && error.response.status === 429) {
            return res.status(429).json({ error: "You have exceeded your quota or hit the rate limit." });
        }
        res.status(500).json({ error: "Failed to fetch response from OpenAI." });
    }
});

// GET method to fetch ChatGPT models using OpenAI API
app.get('/api/chatgpt/models', async (req, res) => {
    try {
        // Make the request to OpenAI to fetch available models
        const response = await axios.get('https://api.openai.com/v1/models', {
            headers: {
                Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, // Use the API key from your .env
            },
        });

        // Send the list of models as the response
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching models from OpenAI:', error.message);

        if (error.response && error.response.status === 429) {
            res.status(429).json({ error: "You have exceeded your quota or hit the rate limit." });
        } else if (error.response && error.response.status === 401) {
            res.status(401).json({ error: "Unauthorized. Please check your OpenAI API key." });
        } else {
            res.status(500).json({ error: "Failed to fetch models from OpenAI." });
        }
    }
});

// Start the Express server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
