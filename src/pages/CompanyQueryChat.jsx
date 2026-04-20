import { useParams, useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';

const mockQueryDetails = {
  'QRY-3042': { title: 'Service Interruption Response', status: 'Action Required', priority: 'High', customer: 'John Doe', description: 'Customer reports complete internet outage since yesterday evening in sector 4A.' },
  'QRY-3041': { title: 'Billing Dispute Resolution', status: 'Pending Review', priority: 'Medium', customer: 'Jane Smith', description: 'Dispute over extra charges on last month invoice for international calls.' },
  'QRY-3038': { title: 'Product Quality Complaint', status: 'In Progress', priority: 'Low', customer: 'Alice Johnson', description: 'Received damaged goods in recent delivery. Wants a replacement.' },
};

export default function CompanyQueryChat() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    { sender: 'bot', text: `Automated Context: This is the internal resolution channel for ${id}. The customer has already been notified that you are reviewing this case.`, time: new Date(Date.now() - 3600000) }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const queryDetails = mockQueryDetails[id] || { title: 'General Support Request', status: 'Open', priority: 'Normal', customer: 'Unknown', description: 'No extra context found.' };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const authMessage = { sender: 'agent', text: inputValue, time: new Date() };
    setMessages(prev => [...prev, authMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate bot/system response
    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [...prev, { 
        sender: 'bot', 
        text: "System: Message securely recorded and sent to the customer portal. The status of this query has been updated to 'In Progress'.", 
        time: new Date() 
      }]);
    }, 1200);
  };

  return (
    <div className="app-container" style={{ backgroundColor: '#F1F5F9' }}>
      <style>{`
        .chat-page-container {
          padding: 2rem 5%;
          max-width: 1400px;
          margin: 0 auto;
          width: 100%;
          display: grid;
          grid-template-columns: 350px 1fr;
          gap: 2rem;
          height: calc(100vh - 100px);
        }

        .details-pane {
          background: #ffffff;
          border-radius: 16px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
          border: 1px solid #e2e8f0;
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
        }

        .back-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          color: #64748b;
          font-weight: 500;
          font-size: 0.9rem;
          margin-bottom: 2rem;
          cursor: pointer;
          transition: color 0.2s;
          background: none;
          border: none;
          padding: 0;
        }

        .back-btn:hover {
          color: #0f172a;
        }

        .detail-group {
          margin-bottom: 1.5rem;
        }

        .detail-label {
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #94a3b8;
          margin-bottom: 0.5rem;
          font-weight: 600;
        }

        .detail-value {
          font-size: 1rem;
          color: #1e293b;
          font-weight: 500;
          line-height: 1.5;
        }

        .chat-pane {
          background: #ffffff;
          border-radius: 16px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
          border: 1px solid #e2e8f0;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .chat-header {
          padding: 1.5rem;
          border-bottom: 1px solid #e2e8f0;
          display: flex;
          align-items: center;
          gap: 1rem;
          background: #f8fafc;
        }

        .chat-icon {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          background: #e0e7ff;
          color: #4f46e5;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.25rem;
        }

        .chat-messages {
          flex: 1;
          padding: 1.5rem;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          background-color: #fafafa;
        }

        .message-wrapper {
          display: flex;
          flex-direction: column;
          max-width: 75%;
          animation: slideIn 0.3s ease-out forwards;
        }

        .message-wrapper.agent {
          align-self: flex-end;
          align-items: flex-end;
        }

        .message-wrapper.bot {
          align-self: flex-start;
          align-items: flex-start;
        }

        .message-bubble {
          padding: 1rem 1.25rem;
          border-radius: 16px;
          font-size: 0.95rem;
          line-height: 1.5;
        }

        .agent .message-bubble {
          background: #0f172a;
          color: white;
          border-bottom-right-radius: 4px;
        }

        .bot .message-bubble {
          background: #ffffff;
          color: #334155;
          border: 1px solid #e2e8f0;
          border-bottom-left-radius: 4px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.02);
        }

        .message-time {
          font-size: 0.7rem;
          color: #94a3b8;
          margin-top: 0.4rem;
        }

        .chat-input-area {
          padding: 1.25rem;
          background: #ffffff;
          border-top: 1px solid #e2e8f0;
        }

        .chat-input-form {
          display: flex;
          gap: 0.75rem;
        }

        .chat-input {
          flex: 1;
          padding: 1rem;
          border-radius: 8px;
          border: 1px solid #e2e8f0;
          background: #f8fafc;
          font-size: 0.95rem;
          outline: none;
          transition: all 0.2s;
        }

        .chat-input:focus {
          border-color: #0f172a;
          background: #ffffff;
        }

        .send-btn {
          padding: 0 1.5rem;
          border-radius: 8px;
          background: #0f172a;
          color: white;
          border: none;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
        }

        .send-btn:hover {
          background: #334155;
        }

        .send-btn:disabled {
          background: #cbd5e1;
          cursor: not-allowed;
        }

        .typing-indicator {
          display: flex;
          gap: 4px;
          padding: 0.5rem 1rem;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          border-bottom-left-radius: 4px;
          align-items: center;
          height: 40px;
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

        @keyframes slideIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 900px) {
          .chat-page-container {
            grid-template-columns: 1fr;
            height: auto;
          }
          .chat-pane {
            height: 600px;
          }
        }
      `}</style>
      
      <div className="chat-page-container">
        
        {/* Left Pane - Context & Actions */}
        <div className="details-pane">
          <button className="back-btn" onClick={() => navigate('/company')}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
            Back to Dashboard
          </button>

          <h2 style={{ margin: '0 0 1.5rem 0', fontSize: '1.25rem', color: '#0f172a' }}>Case Information</h2>
          
          <div className="detail-group">
            <div className="detail-label">Query ID</div>
            <div className="detail-value">{id}</div>
          </div>
          
          <div className="detail-group">
            <div className="detail-label">Customer Name</div>
            <div className="detail-value">{queryDetails.customer}</div>
          </div>
          
          <div className="detail-group">
            <div className="detail-label">Priority Level</div>
            <div className="detail-value">
               <span style={{ color: queryDetails.priority === 'High' ? '#ef4444' : queryDetails.priority === 'Medium' ? '#f59e0b' : '#10b981', fontWeight: 'bold' }}>
                  {queryDetails.priority}
               </span>
            </div>
          </div>

          <div className="detail-group">
            <div className="detail-label">Issue Overview</div>
            <div className="detail-value" style={{ backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.9rem' }}>
              {queryDetails.description}
            </div>
          </div>
        </div>

        {/* Right Pane - Chatbot Channel */}
        <div className="chat-pane">
          <div className="chat-header">
            <div className="chat-icon">💬</div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#0f172a' }}>{queryDetails.title}</h3>
              <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.8rem', color: '#64748b' }}>Resolution Chat Channel</p>
            </div>
          </div>
          
          <div className="chat-messages">
            {messages.map((msg, idx) => (
              <div key={idx} className={`message-wrapper ${msg.sender}`}>
                <div className="message-bubble">{msg.text}</div>
                <div className="message-time">
                  {msg.sender === 'agent' ? 'You - ' : 'System Bot - '}
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
                placeholder="Type resolution message to customer or bot commands..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
              <button type="submit" className="send-btn" disabled={!inputValue.trim()}>
                Send Response
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}
