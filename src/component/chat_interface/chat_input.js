import React from "react";

const ChatInput = ({ inputMessage, setInputMessage, sendMessage }) => {
  return (
    <div className="chat-input">
      <input
        type="text"
        value={inputMessage}
        placeholder="Entrez vos symptômes, séparés par des virgules..."
        onChange={(e) => setInputMessage(e.target.value)}
        onKeyPress={(e) => e.key === "Enter" && sendMessage()} // Envoi avec la touche Entrée
      />
      <button onClick={sendMessage}>Envoyer</button>
    </div>
  );
};

export default ChatInput;
