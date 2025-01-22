import React, { useState } from "react";
import "./chat_interface.css";

const ChatInterface = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");

  const sendMessage = () => {
    if (inputValue.trim() === "") return;

    setMessages([
      ...messages,
      { id: Date.now(), author: "user", text: inputValue },
    ]);
    setInputValue(""); // Réinitialiser l’input
  };

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
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Écrivez votre message..."
        />
        <button onClick={sendMessage}>Envoyer</button>
      </div>
    </div>
  );
};
export default ChatInterface;