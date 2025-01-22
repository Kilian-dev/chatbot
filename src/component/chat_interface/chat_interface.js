import React, { useState } from "react";

const ChatInterface = () => {
  const [messages, setMessages] = useState([
    { id: 1, author: "user", text: "Bonjour" },
    { id: 2, author: "bot", text: "Bonjour ! Comment puis-je vous aider ?" },
  ]);

  return (
    <div className="chat-container">
      <div className="chat-header">Chatbot Interface</div>
      <div className="chat-messages">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`chat-message ${
              message.author === "user" ? "user-message" : "bot-message"
            }`}
          >
            {message.text}
          </div>
        ))}
      </div>
      <div className="chat-input">
        <input type="text" placeholder="Écrivez votre message..." />
        <button>Envoyer</button>
      </div>
    </div>
  );
};

export default ChatInterface;