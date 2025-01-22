import React from "react";

const ChatInput = ({ inputMessage, setInputMessage, sendMessage }) => {
  return (
    <div className="chat-input">
      <input
        type="text"
        value={inputMessage}
        onChange={(e) => setInputMessage(e.target.value)}
        placeholder="Écrivez votre message..."
      />
      <button onClick={sendMessage}>Envoyer</button>
    </div>
  );
};

export default ChatInput;
