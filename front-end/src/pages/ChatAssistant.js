import React, { useState } from 'react';
import ChatInput from './ChatInput';

function ChatAssistant() {
    const [messages, setMessages] = useState([
        { text: 'Hi there! How can I help you today?', sender: 'assistant' }
    ]);

    const handleSendMessage = async (newMessage) => {
        setMessages((prevMessages) => [...prevMessages, { text: newMessage, sender: 'user' }]);

        try {
            const response = await fetch('http://localhost:3030/api/chat/message', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: newMessage }),
            });

            const data = await response.json();
            data.forEach(msg => {
                setMessages((prevMessages) => [
                    ...prevMessages,
                    { text: msg.text, sender: 'assistant' },
                ]);
            });
        } catch (error) {
            console.error('Error sending message:', error);
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
