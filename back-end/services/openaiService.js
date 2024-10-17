import axios from 'axios';

async function makeOpenAIRequest(data) {
  const maxRetries = 5;
  let attempt = 0;

  while (attempt < maxRetries) {
    try {
      const response = await axios.post('https://api.openai.com/v1/chat/completions', data, {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, // Use an environment variable
        },
      });
      return response.data; // Return the successful response
    } catch (error) {
      if (error.response && error.response.status === 429) {
        console.warn(`Attempt ${attempt + 1} failed: Too many requests. Retrying...`);
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000)); // Exponential backoff
        attempt++;
      } else {
        console.error('Error with OpenAI API:', error);
        throw error; // Rethrow if it's not a 429 error
      }
    }
  }

  throw new Error('Max retries reached'); // If all attempts fail
}

export { makeOpenAIRequest };
