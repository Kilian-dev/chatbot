import React from "react";

const ChatMessage = ({ message }) => {
  const { author, text } = message;

  return (
    <div className={`chat-message ${author}`}>
      <span className="author">{author === "user" ? "Vous" : "Bot"} :</span> {text}
    </div>
  );
};

export default ChatMessage;