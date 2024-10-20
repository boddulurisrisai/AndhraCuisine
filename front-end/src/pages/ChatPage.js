import React, { useState } from 'react';
import axios from 'axios';

const ChatPage = () => {
    const [message, setMessage] = useState('');
    const [response, setResponse] = useState('');

    const sendMessage = async () => {
        try {
            const res = await axios.post('http://localhost:3030/api/chat/recommendation', { message });
            setResponse(res.data.text);
        } catch (error) {
            console.error('Error with recommendation API:', error);
            setResponse('Sorry, there was an issue with the recommendation service.');
        }
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
                </div>
            )}
        </div>
    );
};

export default ChatPage;
