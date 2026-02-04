import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import './Chatbot.css';

const Chatbot = ({ period, onClose }) => {
  const [messages, setMessages] = useState([
    {
      type: 'bot',
      text: "Hi! 👋 I'm your AI carbon footprint assistant. Ask me anything about reducing your emissions!",
      timestamp: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const suggestedQuestions = [
    'How can I reduce my transportation emissions?',
    'What are the best ways to save energy at home?',
    'Should I eat less meat?',
    'How do I calculate my carbon footprint?',
    'What\'s my biggest emission source?',
  ];

  const handleSend = async (messageText) => {
    const textToSend = messageText || input.trim();
    
    if (!textToSend) return;

    // Add user message
    const userMessage = {
      type: 'user',
      text: textToSend,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await axios.post('/api/ai/chat', {
        message: textToSend,
        period,
      });

      const botMessage = {
        type: 'bot',
        text: response.data.data.message,
        timestamp: response.data.data.timestamp,
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage = {
        type: 'bot',
        text: "Sorry, I'm having trouble connecting right now. Please try again!",
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="chatbot-container card">
      <div className="chatbot-header">
        <div className="chatbot-title">
          <span className="bot-icon">🤖</span>
          <div>
            <h3>AI Carbon Assistant</h3>
            <p className="bot-status">
              <span className="status-dot"></span> Online
            </p>
          </div>
        </div>
        {onClose && (
          <button className="close-btn" onClick={onClose}>
            ✕
          </button>
        )}
      </div>

      <div className="chatbot-messages">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`message ${message.type === 'user' ? 'user-message' : 'bot-message'}`}
          >
            {message.type === 'bot' && (
              <div className="message-avatar">🤖</div>
            )}
            <div className="message-content">
              <div className="message-text">
                {message.type === 'bot' ? (
                  <ReactMarkdown>{message.text}</ReactMarkdown>
                ) : (
                  message.text
                )}
              </div>
              <div className="message-time">{formatTime(message.timestamp)}</div>
            </div>
            {message.type === 'user' && (
              <div className="message-avatar user-avatar">👤</div>
            )}
          </div>
        ))}

        {loading && (
          <div className="message bot-message">
            <div className="message-avatar">🤖</div>
            <div className="message-content">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Questions */}
      {messages.length === 1 && (
        <div className="suggested-questions">
          <p className="suggestions-label">Try asking:</p>
          <div className="suggestions-grid">
            {suggestedQuestions.map((question, index) => (
              <button
                key={index}
                className="suggestion-btn"
                onClick={() => handleSend(question)}
                disabled={loading}
              >
                {question}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="chatbot-input">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask me anything about reducing your carbon footprint..."
          rows="1"
          disabled={loading}
        />
        <button
          className="send-btn"
          onClick={() => handleSend()}
          disabled={loading || !input.trim()}
        >
          {loading ? '⏳' : '📤'}
        </button>
      </div>
    </div>
  );
};

export default Chatbot;
