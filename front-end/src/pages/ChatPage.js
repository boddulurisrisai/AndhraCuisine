import React, { useState } from 'react';
import axios from 'axios';

const ChatPage = () => {
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');

  const sendMessage = async () => {
    const res = await axios.post('http://localhost:5000/recommend', { message });
    setResponse(res.data.recommendation);
  };

  return (
    <div className="chat-container">
      <h2>Ask for Food Recommendations</h2>
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Enter your preferences..."
      />
      <button onClick={sendMessage}>Send</button>
      {response && (
        <div className="response">
          <p>{response}</p>
          <a href="/checkout">Buy this product</a>
        </div>
      )}
    </div>
  );
};

export default ChatPage;
