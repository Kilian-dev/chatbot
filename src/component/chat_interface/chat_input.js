import React from "react";

const ChatInput = ({ inputMessage, setInputMessage, sendMessage }) => {
  return (
    <div className="chat-input">
      <input
        type="text"
        value={inputMessage}
        placeholder="Enter your symptoms, separated by commas..."
        onChange={(e) => setInputMessage(e.target.value)}
        onKeyPress={(e) => e.key === "Enter" && sendMessage()} // Send message on Enter key press
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default ChatInput;
