import { useState, useRef, useEffect } from 'react';

const mockQueries = [
  { id: 'QRY-1029', title: 'Pothole repair request on 5th Ave', status: 'In Progress', date: '2026-04-18', category: 'Infrastructure' },
  { id: 'QRY-1028', title: 'Property tax discrepancy', status: 'Resolved', date: '2026-04-15', category: 'Finance' },
  { id: 'QRY-1025', title: 'Streetlight out in neighborhood', status: 'Pending', date: '2026-04-12', category: 'Maintenance' },
];

const mockBotWelcome = "Hello! I am your automated support assistant. How can I help you with your queries today?";

export default function CustomerDashboard() {
  const [messages, setMessages] = useState([{ sender: 'bot', text: mockBotWelcome, time: new Date() }]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage = { sender: 'user', text: inputValue, time: new Date() };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate bot response
    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [...prev, { 
        sender: 'bot', 
        text: "I've received your message. Our system is currently analyzing your request. Is there anything else you'd like to add?", 
        time: new Date() 
      }]);
    }, 1500);
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Resolved': return 'badge-success';
      case 'Pending': return 'badge-warning';
      case 'In Progress': return 'badge-primary'; // Using primary for in progress
      default: return 'badge-default';
    }
  };

  return (
    <div className="app-container" style={{ backgroundColor: '#F8FAFC' }}>
      <style>{`
        .dashboard-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
          height: calc(100vh - 120px);
          max-height: 800px;
          margin-top: 1rem;
        }
        
        .pane {
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(10px);
          border-radius: 16px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.05), inset 0 1px 0 rgba(255,255,255,0.6);
          border: 1px solid rgba(229, 231, 235, 0.5);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .pane:hover {
          box-shadow: 0 15px 35px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.8);
        }

        .pane-header {
          padding: 1.5rem;
          background: linear-gradient(to right, #ffffff, #f8fafc);
          border-bottom: 1px solid #f1f5f9;
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: sticky;
          top: 0;
          z-index: 10;
        }

        .pane-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: #1e293b;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .pane-title-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          background: #eff6ff;
          color: #3b82f6;
          border-radius: 10px;
          font-size: 1.2rem;
        }

        /* Query List Styles */
        .query-list {
          padding: 1.5rem;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .query-card {
          padding: 1.25rem;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
          background: #ffffff;
          transition: all 0.2s;
          cursor: pointer;
        }

        .query-card:hover {
          border-color: #cbd5e1;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.03);
        }

        .query-card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 0.75rem;
        }

        .query-id {
          font-size: 0.75rem;
          font-weight: 600;
          color: #64748b;
          letter-spacing: 0.5px;
        }

        .query-title {
          font-weight: 600;
          color: #0f172a;
          font-size: 1rem;
          margin-top: 0.25rem;
          line-height: 1.4;
        }

        .query-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 1rem;
          font-size: 0.8rem;
          color: #94a3b8;
        }

        .badge-primary {
          background-color: #dbeafe;
          color: #1e40af;
        }

        /* Chat Styles */
        .chat-container {
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          background-color: #f8fafc;
        }

        .chat-messages {
          flex: 1;
          padding: 1.5rem;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .message-wrapper {
          display: flex;
          flex-direction: column;
          max-width: 80%;
          animation: fadeIn 0.3s ease-out forwards;
        }

        .message-wrapper.user {
          align-self: flex-end;
          align-items: flex-end;
        }

        .message-wrapper.bot {
          align-self: flex-start;
          align-items: flex-start;
        }

        .message-bubble {
          padding: 1rem 1.25rem;
          border-radius: 18px;
          font-size: 0.95rem;
          line-height: 1.5;
          position: relative;
          box-shadow: 0 2px 5px rgba(0,0,0,0.02);
        }

        .user .message-bubble {
          background: linear-gradient(135deg, #3b82f6, #2563eb);
          color: white;
          border-bottom-right-radius: 4px;
        }

        .bot .message-bubble {
          background: #ffffff;
          color: #1e293b;
          border: 1px solid #e2e8f0;
          border-bottom-left-radius: 4px;
        }

        .message-time {
          font-size: 0.7rem;
          color: #94a3b8;
          margin-top: 0.4rem;
          margin-bottom: 0;
        }

        .chat-input-area {
          padding: 1.25rem;
          background: #ffffff;
          border-top: 1px solid #e2e8f0;
        }

        .chat-input-form {
          display: flex;
          gap: 0.75rem;
          position: relative;
        }

        .chat-input {
          flex: 1;
          padding: 1rem 1.25rem;
          border-radius: 99px;
          border: 1px solid #e2e8f0;
          background: #f8fafc;
          font-size: 0.95rem;
          transition: all 0.2s;
          outline: none;
        }

        .chat-input:focus {
          border-color: #3b82f6;
          background: #ffffff;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .send-btn {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: linear-gradient(135deg, #3b82f6, #2563eb);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          border: none;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
          box-shadow: 0 4px 10px rgba(37, 99, 235, 0.2);
        }

        .send-btn:hover {
          transform: scale(1.05);
          box-shadow: 0 6px 14px rgba(37, 99, 235, 0.3);
        }

        .send-btn:disabled {
          background: #cbd5e1;
          box-shadow: none;
          cursor: not-allowed;
          transform: none;
        }

        .typing-indicator {
          display: flex;
          gap: 4px;
          padding: 0.5rem 1rem;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 18px;
          border-bottom-left-radius: 4px;
          align-self: flex-start;
          width: fit-content;
          align-items: center;
          height: 40px;
          animation: fadeIn 0.3s;
        }

        .dot {
          width: 6px;
          height: 6px;
          background: #94a3b8;
          border-radius: 50%;
          animation: bounce 1.4s infinite ease-in-out both;
        }

        .dot:nth-child(1) { animation-delay: -0.32s; }
        .dot:nth-child(2) { animation-delay: -0.16s; }

        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0); }
          40% { transform: scale(1); }
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 768px) {
          .dashboard-grid {
            grid-template-columns: 1fr;
            height: auto;
            max-height: none;
          }
          .chat-container {
            height: 500px;
          }
        }
      `}</style>

      <div className="main-content" style={{ padding: '0 5% 2rem' }}>
        <div className="dashboard-grid">
          
          {/* Left Pane - Raised Queries */}
          <div className="pane">
            <div className="pane-header">
              <div className="pane-title">
                <div className="pane-title-icon">📋</div>
                My Raised Queries
              </div>
              <span className="badge badge-default">{mockQueries.length} Total</span>
            </div>
            <div className="query-list">
              {mockQueries.map(query => (
                <div key={query.id} className="query-card">
                  <div className="query-card-header">
                    <div>
                      <span className="query-id">{query.id}</span>
                      <h3 className="query-title">{query.title}</h3>
                    </div>
                    <span className={`badge ${getStatusBadgeClass(query.status)}`}>
                      {query.status}
                    </span>
                  </div>
                  <div className="query-footer">
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                      {query.date}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
                      {query.category}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Pane - Support Chatbot */}
          <div className="pane">
            <div className="pane-header">
              <div className="pane-title">
                <div className="pane-title-icon" style={{ background: '#ecfdf5', color: '#10b981' }}>🤖</div>
                Support Assistant
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: '#10b981', fontWeight: '500' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }}></span>
                Online
              </div>
            </div>
            
            <div className="chat-container">
              <div className="chat-messages">
                <div style={{ textAlign: 'center', fontSize: '0.8rem', color: '#94a3b8', margin: '0.5rem 0 1.5rem' }}>
                  Today
                </div>
                {messages.map((msg, idx) => (
                  <div key={idx} className={`message-wrapper ${msg.sender}`}>
                    <div className="message-bubble">
                      {msg.text}
                    </div>
                    <div className="message-time">
                      {msg.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="message-wrapper bot">
                    <div className="typing-indicator">
                      <div className="dot"></div>
                      <div className="dot"></div>
                      <div className="dot"></div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
              
              <div className="chat-input-area">
                <form className="chat-input-form" onSubmit={handleSendMessage}>
                  <input
                    type="text"
                    className="chat-input"
                    placeholder="Type your message here..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                  />
                  <button type="submit" className="send-btn" disabled={!inputValue.trim()}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="22" y1="2" x2="11" y2="13"></line>
                      <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                    </svg>
                  </button>
                </form>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
