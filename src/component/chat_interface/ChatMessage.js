import React from "react";

const ChatMessage = ({ message }) => {
  const { text, author } = message;

  return (
    <div className={`chat-message ${author}`}>
      {text}
    </div>
  );
};

export default ChatMessage;
