import React, { useState } from 'react';
import ChatInput from './ChatInput'; // Input component for the chat

function ChatAssistant() {
    const [messages, setMessages] = useState([
        { text: 'Welcome to our food service! How can I assist you today?', sender: 'assistant' }
    ]);

    const handleSendMessage = async (newMessage) => {
        setMessages((prevMessages) => [...prevMessages, { text: newMessage, sender: 'user' }]);

        try {
            // Sending message to backend server, which interacts with OpenAI
            const response = await fetch('http://localhost:3030/api/chat/message', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: newMessage }),
            });

            const data = await response.json();

            // Add assistant's response to the chat
            setMessages((prevMessages) => [
                ...prevMessages,
                { text: data.text, sender: 'assistant' },
            ]);

            // If menu recommendations are available, display them in the chat
            if (data.menuItems) {
                setMessages((prevMessages) => [
                    ...prevMessages,
                    { text: `Recommended Menu: ${data.menuItems.join(', ')}`, sender: 'assistant' },
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
                        {message.text}
                    </div>
                ))}
            </div>
            <ChatInput onSendMessage={handleSendMessage} />
        </div>
    );
}

export default ChatAssistant;
