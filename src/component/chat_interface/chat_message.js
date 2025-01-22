import React from "react";

const ChatMessage = ({ message }) => {
  return (
    <div
      className={`chat-message ${
        message.author === "user" ? "user-message" : "bot-message"
      }`}
    >
      {message.text}
    </div>
  );
};

export default ChatMessage;
