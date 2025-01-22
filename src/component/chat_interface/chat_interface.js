import "./chat_interface.css";
import React, { useState, useEffect } from "react";
import ChatMessage from "./chat_message";
import ChatInput from "./chat_input";

// Connexion au serveur WebSocket
const SOCKET_URL = "ws://localhost:4000";

const ChatInterface = () => {
  const [messages, setMessages] = useState([
    { id: 1, author: "user", text: "Bonjour" },
    { id: 2, author: "bot", text: "Bonjour ! Comment puis-je vous aider ?" },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [socket, setSocket] = useState(null);

  // Effet pour gérer la connexion WebSocket
  useEffect(() => {
    console.log("Frontend: Initialisation de la connexion...");

    // Création de la connexion WebSocket
    const ws = new WebSocket(SOCKET_URL);

    ws.onopen = () => {
      console.log("Frontend: Connexion établie avec le serveur.");
    };

    ws.onmessage = (event) => {
      try {
        const response = JSON.parse(event.data);
        console.log("Frontend: Message reçu : ", response);

        setMessages((prevMessages) => [
          ...prevMessages,
          {
            id: prevMessages.length + 1,
            author: "bot",
            text: `Maladie : ${response.disease}, Traitement : ${response.treatment}`,
          },
        ]);
      } catch (error) {
        console.error("Frontend: Erreur lors du parsing des données : ", error);
      }
    };

    ws.onclose = () => {
      console.log("Frontend: Connexion fermée.");
    };

    ws.onerror = (error) => {
      console.error("Frontend: Une erreur est survenue : ", error);
    };

    setSocket(ws);

    // Nettoyage à la fermeture du composant
    return () => {
      console.log("Frontend: Fermeture de la connexion...");
      ws.close();
    };
  }, []);

  // Fonction pour envoyer un message au serveur
  const sendMessage = () => {
    if (inputMessage.trim() && socket) {
      console.log("Frontend: Envoi du message : ", inputMessage);

      setMessages((prevMessages) => [
        ...prevMessages,
        { id: prevMessages.length + 1, author: "user", text: inputMessage },
      ]);

      // Envoi des symptômes au serveur WebSocket
      socket.send(inputMessage);
      setInputMessage("");  
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-header">Chatbot Interface</div>
      <div className="chat-messages">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
      </div>
      <ChatInput
        inputMessage={inputMessage}
        setInputMessage={setInputMessage}
        sendMessage={sendMessage}
      />
    </div>
  );
};

export default ChatInterface;
