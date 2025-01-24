import "./chat_interface.css";
import React, { useState, useEffect } from "react";
import ChatMessage from "./ChatMessage";
import ChatInput from "./chat_input";
import { io } from "socket.io-client"; // Import de socket.io-client

// Connexion au serveur Socket.IO
const SOCKET_URL = "http://localhost:5000"; // Assurez-vous que Flask écoute sur ce port

const ChatInterface = () => {
  const [messages, setMessages] = useState([
    { id: 1, author: "bot", text: "Bonjour ! Entrez vos symptômes pour un diagnostic." },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [socket, setSocket] = useState(null);

  // Initialiser la connexion Socket.IO
  useEffect(() => {
    console.log("Frontend: Initialisation de la connexion Socket.IO...");

    const socketInstance = io(SOCKET_URL); // Créer une connexion Socket.IO

    socketInstance.on("connect", () => {
      console.log("Frontend: Connexion établie avec le serveur Socket.IO.");
    });

    socketInstance.on("message", (data) => {
      try {
        const response = data; // Les données envoyées par le serveur
        console.log("Frontend: Réponse reçue :", response);

        
        // Formater les probabilités pour l'affichage
        const sortedProbabilities = Object.entries(response.disease_probabilities)
          .sort(([, a], [, b]) => b - a) // Trier par probabilité décroissante
          .slice(0, 3) // Garder les 3 premières probabilités
          .map(([disease, probability]) => `${disease}: ${(probability * 100).toFixed(2)}%`)
          .join(", ");

        // Ajouter la réponse du serveur (maladie et traitement)
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            id: prevMessages.length + 1,
            author: "bot",
            text: `Maladie prédite : ${response.disease}. Probabilités : ${sortedProbabilities}`,
          },
        ]);
      } catch (error) {
        console.error("Frontend: Erreur lors du traitement du message :", error);
      }
    });

    socketInstance.on("disconnect", () => {
      console.log("Frontend: Connexion Socket.IO fermée.");
    });

    setSocket(socketInstance);

    // Nettoyage à la fermeture du composant
    return () => {
      console.log("Frontend: Fermeture de la connexion Socket.IO...");
      socketInstance.disconnect();
    };
  }, []);

  // Envoyer un message brut au serveur Socket.IO
  const sendMessage = () => {
    if (inputMessage.trim() && socket) {
      console.log("Frontend: Envoi des symptômes :", inputMessage);

      // Ajouter le message utilisateur à l'interface
      setMessages((prevMessages) => [
        ...prevMessages,
        { id: prevMessages.length + 1, author: "user", text: inputMessage },
      ]);

      // Envoyer le message brut (texte simple) au serveur
      socket.emit("message", inputMessage); // Envoi d'un message brut en tant que texte
      setInputMessage(""); // Réinitialiser l'input après l'envoi
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
