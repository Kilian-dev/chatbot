import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import ChatMessage from "./chat_message";
import ChatInput from "./chat_input";
import "./chat_interface.css";

// Connexion au serveur WebSocket
const SOCKET_URL = "http://127.0.0.1:5000";
const socket = io(SOCKET_URL);

const ChatInterface = () => {
  const [messages, setMessages] = useState([
    { id: 1, author: "user", text: "Hello" },
    { id: 2, author: "bot", text: "Hello! Describe your symptoms to get a diagnosis." },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [pendingQuestion, setPendingQuestion] = useState(null);
  const messagesEndRef = useRef(null);

  // Fonction pour scroller automatiquement vers le bas
  const scrollToBottom = () => {
    const messagesContainer = messagesEndRef.current?.parentElement;
    if (messagesContainer) {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
  };

  // Connexion au WebSocket
  useEffect(() => {
    console.log("Frontend: Connexion au serveur...");

    socket.on("connect", () => console.log("Frontend: Connecté au serveur."));

    socket.on("message", (response) => {
      console.log("Frontend: Réponse reçue : ", response);

      setTimeout(() => {
        setIsLoading(false);

        if (response.question) {
          setPendingQuestion(response.question);
        } else {
          let botMessage = response.disease
            ? `Disease: ${response.disease}, Treatment: ${response.treatment}`
            : "I couldn't find a matching result. Please try again with different symptoms.";

          setMessages((prevMessages) => [
            ...prevMessages,
            { id: prevMessages.length + 1, author: "bot", text: botMessage },
          ]);
          setPendingQuestion(null);
        }

        scrollToBottom();
      }, 2000);
    });

    socket.on("disconnect", () => console.log("Frontend: Déconnecté."));
    socket.on("connect_error", (error) => console.error("Frontend: Erreur de connexion : ", error));

    return () => {
      console.log("Frontend: Fermeture de la connexion...");
      socket.off("message");
    };
  }, []);

  // Fonction pour envoyer un message utilisateur
  const sendMessage = () => {
    if (!inputMessage.trim()) return;

    const userMessage = inputMessage.toLowerCase().trim();
    let botReply = null;

    if (userMessage === "hello") {
      botReply = "Hello! Describe your symptoms to get a diagnosis.";
    } else if (userMessage === "thank you") {
      botReply = "You're welcome! I'm here to assist you.";
    }

    setMessages((prevMessages) => [
      ...prevMessages,
      { id: prevMessages.length + 1, author: "user", text: inputMessage },
    ]);

    if (botReply) {
      setMessages((prevMessages) => [
        ...prevMessages,
        { id: prevMessages.length + 2, author: "bot", text: botReply },
      ]);
      scrollToBottom();
    } else {
      setIsLoading(true);
      socket.emit("message", inputMessage);
    }

    setInputMessage("");
  };

  // Fonction pour envoyer le niveau de douleur
  const sendPainLevel = (level) => {
    if (!pendingQuestion) return;
    const symptom = pendingQuestion.match(/'(.*?)'/)[1];
    socket.emit("message", `pain-level:${symptom}:${level}`);
    setPendingQuestion(null);
  };

  return (
    <div className="chat-container">
      <div className="chat-header">Chatbot Interface</div>
      <div className="chat-messages">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}

        {isLoading && <div className="chat-message bot"><span className="loader">The bot is thinking...</span></div>}

        {pendingQuestion && (
          <div className="question-box">
            <p>{pendingQuestion}</p>
            <div className="pain-level-buttons">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                <button key={num} className="degree-button" onClick={() => sendPainLevel(num)}>
                  {num}
                </button>
              ))}
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {!pendingQuestion && (
        <ChatInput inputMessage={inputMessage} setInputMessage={setInputMessage} sendMessage={sendMessage} />
      )}
    </div>
  );
};

export default ChatInterface;
