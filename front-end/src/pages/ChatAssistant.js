import React, { useState } from 'react';
import ChatInput from './ChatInput'; // Input component for the chat

function ChatAssistant() {
    const [messages, setMessages] = useState([
        { text: 'Welcome to our food service! How can I assist you today?', sender: 'assistant' }
    ]);

    const handleSendMessage = async (newMessage) => {
        setMessages((prevMessages) => [...prevMessages, { text: newMessage, sender: 'user' }]);

        try {
            // Sending message to the correct backend API, which interacts with OpenAI
            const response = await fetch('http://localhost:3030/api/chat/recommendation', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: newMessage }),
            });

            const data = await response.json();

            // Add assistant's response to the chat
            setMessages((prevMessages) => [
                ...prevMessages,
                { text: data.recommendation, sender: 'assistant' },
            ]);

            // If products are returned, display them as a list in the chat
            if (data.products && data.products.length > 0) {
                const productList = data.products.map(product => `${product.name}: ${product.description}`).join('\n');
                setMessages((prevMessages) => [
                    ...prevMessages,
                    { text: `Here are some products:\n${productList}`, sender: 'assistant' }
                ]);
            }

        } catch (error) {
            console.error('Error sending message:', error);
            setMessages((prevMessages) => [
                ...prevMessages,
                { text: 'Sorry, there was an issue. Please try again.', sender: 'assistant' }
            ]);
        }
    };

    return (
        <div className="chat-assistant-container">
            <div className="chat-box">
                {messages.map((message, index) => (
                    <div key={index} className={`message ${message.sender}`}>
                        {message.text.split('\n').map((line, i) => (
                            <div key={i}>{line}</div>
                        ))}
                    </div>
                ))}
            </div>
            <ChatInput onSendMessage={handleSendMessage} />
        </div>
    );
}

export default ChatAssistant;
