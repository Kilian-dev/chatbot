import logo from './logo.svg';
import './App.css';
import ChatInterface from './component/chat_interface/chat_interface.js';

function App() {
  return (
    <div className="App">
      <h1>Chatbot Prédiction de Maladie</h1>
      <ChatInterface />
    </div>
  );
}

export default App;
