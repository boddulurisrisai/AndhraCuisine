// controllers/chatController.js

exports.handleChatMessage = (req, res) => {
    const userMessage = req.body.message;
  
    // Simulate a response from the assistant
    let assistantResponse;
  
    // Example logic for product recommendation
    if (userMessage.toLowerCase().includes('menu')) {
      assistantResponse = 'Here’s a suggestion from our menu: Pizza, Pasta, Salad.';
    } else {
      assistantResponse = 'I am not sure how to help with that. Can you please ask about our menu?';
    }
  
    res.json({ message: assistantResponse });
  };
  