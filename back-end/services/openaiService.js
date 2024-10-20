import axios from 'axios';

// Function to make a request to OpenAI API
export const makeOpenAIRequest = async ({ model, messages }) => {
    try {
        const apiKey = process.env.OPENAI_API_KEY; // Ensure API key is loaded from .env

        if (!apiKey) {
            throw new Error("Missing OpenAI API key");
        }

        const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model,
                messages
            },
            {
                headers: {
                    Authorization: `Bearer ${apiKey}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        return response.data; // Return the full response from OpenAI
    } catch (error) {
        console.error("Error with OpenAI API request:", error.response ? error.response.data : error.message);
        throw error;
    }
};
