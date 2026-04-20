import { useState, useRef, useEffect } from 'react';

const mockBotWelcome = "Hello! I am your automated support assistant. How can I help you with your queries today?";
const CUSTOMER_ID = 12;
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const COMPANY_OPTIONS = [
  'Bank of America',
  'Wells Fargo & Company',
  'JPMorgan Chase & Co.',
  'Equifax',
  'Experian',
  'Citibank',
  'TransUnion Intermediate Holdings, Inc.',
  'Ocwen',
  'Capital One',
  'Nationstar Mortgage',
  'U.S. Bancorp',
  'Synchrony Financial',
  'Ditech Financial LLC',
  'Navient Solutions, Inc.',
  'PNC Bank N.A.',
  'Encore Capital Group',
  'HSBC North America Holdings Inc.',
  'Amex',
  'SunTrust Banks, Inc.',
  'Discover',
  'TD Bank US Holding Company',
  'Select Portfolio Servicing, Inc',
  'Portfolio Recovery Associates, Inc.',
  'Citizens Financial Group, Inc.',
  'Fifth Third Financial Corporation',
  'Seterus, Inc.',
  'Barclays PLC',
  'ERC',
  'BB&T Financial',
  'M&T Bank Corporation',
  'Ally Financial Inc.',
  'Regions Financial Corporation',
  'PayPal Holdings, Inc.',
  'USAA Savings',
  'Specialized Loan Servicing LLC',
  'Santander Consumer USA Holdings Inc',
  'Santander Bank US',
  'AES/PHEAA',
  'Expert Global Solutions, Inc.',
  'Flagstar Bank',
  'Resurgent Capital Services L.P.',
  'Navy FCU',
  'CIT Bank National Association',
  'PHH Mortgage',
  'Caliber Home Loans, Inc',
  'Transworld Systems Inc.',
  'KeyBank NA',
  'Bayview Loan Servicing, LLC',
  'Convergent Resources, Inc.',
  'The Western Union Company',
];

const STATE_OPTIONS = [
  'CA', 'NY', 'MD', 'GA', 'AZ', 'IL', 'NC', 'TX', 'DC', 'KY', 'RI', 'TN', 'AR', 'AL',
  'NJ', 'VA', 'FL', 'MN', 'AK', 'OH', 'OR', 'MO', 'LA', 'SC', 'OK', 'WA', 'PA', 'MI',
  'CO', 'KS', 'MA', 'NH', 'NV', 'WV', 'PR', 'DE', 'IN', 'UT', 'ME', 'NE', 'NM', 'WY',
  'CT', 'HI', 'ID', 'MS', 'WI', 'IA', 'MT', 'MH', 'VT', 'AE', 'SD', 'FM', 'VI', 'ND',
  'GU', 'MP', 'AP', 'AS', 'PW', 'AA',
];

export default function CustomerDashboard() {
  const [messages, setMessages] = useState([{ sender: 'bot', text: mockBotWelcome, time: new Date() }]);
  const [queries, setQueries] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [selectedCompany, setSelectedCompany] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [chatStep, setChatStep] = useState('idle');
  const [isTyping, setIsTyping] = useState(false);
  const [isLoadingQueries, setIsLoadingQueries] = useState(true);
  const [isSubmittingQuery, setIsSubmittingQuery] = useState(false);
  const [canRaiseQuery, setCanRaiseQuery] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    const fetchCustomerQueries = async () => {
      setIsLoadingQueries(true);
      setIsTyping(true);

      try {
        const response = await fetch(`${API_BASE_URL}/chatbot/customer/query?customer_id=${CUSTOMER_ID}`);

        if (response.status === 201) {
          const noQueryData = await response.json();
          setQueries([]);
          setCanRaiseQuery(true);
          setChatStep('idle');
          setMessages(prev => [
            ...prev,
            {
              sender: 'bot',
              text: `${noQueryData?.message || 'No query available for this customer id.'} Click "Raise a Query" to start.`,
              time: new Date(),
            },
          ]);
          return;
        }

        if (!response.ok) {
          throw new Error('Failed to fetch customer queries.');
        }

        const data = await response.json();
        const fetchedQueries = Array.isArray(data?.queries) ? data.queries : [];
        setQueries(fetchedQueries);

        if (fetchedQueries.length > 0) {
          setCanRaiseQuery(false);
          setChatStep('locked');
          setMessages(prev => [
            ...prev,
            {
              sender: 'bot',
              text: 'Existing queries found for this customer. New query submission is disabled right now.',
              time: new Date(),
            },
          ]);
        } else {
          setCanRaiseQuery(true);
          setChatStep('idle');
          setMessages(prev => [
            ...prev,
            {
              sender: 'bot',
              text: 'No existing query found. Click "Raise a Query" to start.',
              time: new Date(),
            },
          ]);
        }
      } catch (error) {
        setCanRaiseQuery(true);
        setChatStep('idle');
        setMessages(prev => [
          ...prev,
          {
            sender: 'bot',
            text: error.message || 'Unable to fetch existing queries. You can still raise a new query.',
            time: new Date(),
          },
        ]);
      } finally {
        setIsTyping(false);
        setIsLoadingQueries(false);
      }
    };

    fetchCustomerQueries();
  }, []);

  const handleStartRaiseQuery = () => {
    if (!canRaiseQuery || isSubmittingQuery || chatStep !== 'idle') return;

    setChatStep('state');
    setSelectedState('');
    setSelectedCompany('');
    setMessages(prev => [
      ...prev,
      {
        sender: 'bot',
        text: 'Please select your state from the dropdown.',
        time: new Date(),
      },
    ]);
  };

  const handleStateConfirm = () => {
    if (!selectedState) return;

    setMessages(prev => [
      ...prev,
      { sender: 'user', text: `State: ${selectedState}`, time: new Date() },
      { sender: 'bot', text: 'Now select your company from the dropdown.', time: new Date() },
    ]);
    setChatStep('company');
  };

  const handleCompanyConfirm = () => {
    if (!selectedCompany) return;

    setMessages(prev => [
      ...prev,
      { sender: 'user', text: `Company: ${selectedCompany}`, time: new Date() },
      { sender: 'bot', text: 'Company captured. Please type your query now.', time: new Date() },
    ]);
    setChatStep('query');
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const enteredText = inputValue.trim();
    setMessages(prev => [...prev, { sender: 'user', text: enteredText, time: new Date() }]);
    setInputValue('');

    if (!canRaiseQuery) {
      setMessages(prev => [
        ...prev,
        {
          sender: 'bot',
          text: 'You already have an existing query. New query submission is currently disabled.',
          time: new Date(),
        },
      ]);
      return;
    }

    if (chatStep !== 'query') {
      setMessages(prev => [
        ...prev,
        {
          sender: 'bot',
          text: 'Please use the dropdown selectors for state and company first.',
          time: new Date(),
        },
      ]);
      return;
    }

    setIsTyping(true);
    setIsSubmittingQuery(true);

    try {
      const payload = {
        customer_id: CUSTOMER_ID,
        state: selectedState,
        company: selectedCompany,
        query_text: enteredText,
      };

      const response = await fetch(`${API_BASE_URL}/chatbot/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Unable to raise query right now. Please try again.');
      }

      const responseData = await response.json().catch(() => ({}));
      const createdQuery = {
        id: responseData?.id || `TEMP-${Date.now()}`,
        customer_id: CUSTOMER_ID,
        state: selectedState,
        company: selectedCompany,
        query_text: payload.query_text,
        department: responseData?.department || 'Support',
        status: responseData?.status || 'PENDING',
        date: responseData?.date || new Date().toISOString(),
      };

      setQueries(prev => [createdQuery, ...prev]);
      setCanRaiseQuery(false);
      setChatStep('locked');
      setSelectedCompany('');
      setSelectedState('');
      setIsTyping(false);
      setMessages(prev => [
        ...prev,
        {
          sender: 'bot',
          text: 'Your query has been raised successfully.',
          time: new Date(),
        },
      ]);
    } catch (error) {
      setIsTyping(false);
      setMessages(prev => [
        ...prev,
        {
          sender: 'bot',
          text: error.message || 'Failed to submit query. Please try again.',
          time: new Date(),
        },
      ]);
    } finally {
      setIsSubmittingQuery(false);
    }
  };

  const getStatusBadgeClass = (status) => {
    switch ((status || '').toUpperCase()) {
      case 'RESOLVED': return 'badge-success';
      case 'PENDING': return 'badge-warning';
      case 'IN PROGRESS': return 'badge-primary';
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
          flex-direction: column;
          gap: 0.75rem;
          position: relative;
        }

        .query-metadata-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.75rem;
        }

        .chat-select {
          padding: 0.8rem 1rem;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
          background: #f8fafc;
          font-size: 0.9rem;
          color: #1e293b;
          outline: none;
          transition: all 0.2s;
        }

        .chat-select:focus {
          border-color: #3b82f6;
          background: #ffffff;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .chat-input-row {
          display: flex;
          gap: 0.75rem;
        }

        .raise-query-btn {
          width: 100%;
          border: none;
          border-radius: 12px;
          padding: 0.8rem 1rem;
          font-weight: 600;
          background: linear-gradient(135deg, #22c55e, #16a34a);
          color: #ffffff;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
          box-shadow: 0 6px 14px rgba(22, 163, 74, 0.25);
        }

        .raise-query-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 8px 18px rgba(22, 163, 74, 0.35);
        }

        .raise-query-btn:disabled {
          background: #cbd5e1;
          box-shadow: none;
          cursor: not-allowed;
          transform: none;
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

          .query-metadata-row {
            grid-template-columns: 1fr;
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
              <span className="badge badge-default">{queries.length} Total</span>
            </div>
            <div className="query-list">
              {isLoadingQueries ? (
                <div className="query-card">Loading queries...</div>
              ) : queries.length === 0 ? (
                <div className="query-card">No queries available for this customer.</div>
              ) : (
                queries.map((query) => (
                  <div key={query.id} className="query-card">
                    <div className="query-card-header">
                      <div>
                        <span className="query-id">QRY-{query.id}</span>
                        <h3 className="query-title">{query.query_text}</h3>
                      </div>
                      <span className={`badge ${getStatusBadgeClass(query.status)}`}>
                        {query.status}
                      </span>
                    </div>
                    <div className="query-footer">
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                        {new Date(query.date).toLocaleDateString()}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
                        {query.company}
                      </span>
                    </div>
                  </div>
                ))
              )}
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
                  {canRaiseQuery && chatStep === 'idle' && (
                    <button
                      type="button"
                      className="raise-query-btn"
                      onClick={handleStartRaiseQuery}
                      disabled={isSubmittingQuery}
                    >
                      Raise a Query
                    </button>
                  )}
                  {canRaiseQuery && chatStep === 'state' && (
                    <div className="query-metadata-row">
                      <select
                        className="chat-select"
                        value={selectedState}
                        onChange={(e) => setSelectedState(e.target.value)}
                        disabled={isSubmittingQuery}
                      >
                        <option value="">Select state</option>
                        {STATE_OPTIONS.map((state) => (
                          <option key={state} value={state}>
                            {state}
                          </option>
                        ))}
                      </select>
                      <button
                        type="button"
                        className="raise-query-btn"
                        onClick={handleStateConfirm}
                        disabled={!selectedState || isSubmittingQuery}
                      >
                        Continue
                      </button>
                    </div>
                  )}
                  {canRaiseQuery && chatStep === 'company' && (
                    <div className="query-metadata-row">
                      <select
                        className="chat-select"
                        value={selectedCompany}
                        onChange={(e) => setSelectedCompany(e.target.value)}
                        disabled={isSubmittingQuery}
                      >
                        <option value="">Select company</option>
                        {COMPANY_OPTIONS.map((company) => (
                          <option key={company} value={company}>
                            {company}
                          </option>
                        ))}
                      </select>
                      <button
                        type="button"
                        className="raise-query-btn"
                        onClick={handleCompanyConfirm}
                        disabled={!selectedCompany || isSubmittingQuery}
                      >
                        Continue
                      </button>
                    </div>
                  )}
                  <div className="chat-input-row">
                    <input
                      type="text"
                      className="chat-input"
                      placeholder={
                        !canRaiseQuery
                          ? 'Existing query found. New query disabled.'
                          : chatStep === 'idle'
                            ? 'Click "Raise a Query" to start.'
                          : chatStep === 'state'
                            ? 'Select state above'
                            : chatStep === 'company'
                              ? 'Select company above'
                              : 'Describe your query...'
                      }
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      disabled={!canRaiseQuery || isSubmittingQuery || chatStep === 'idle' || chatStep === 'state' || chatStep === 'company'}
                    />
                    <button
                      type="submit"
                      className="send-btn"
                      disabled={!canRaiseQuery || isSubmittingQuery || chatStep !== 'query' || !inputValue.trim()}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="22" y1="2" x2="11" y2="13"></line>
                        <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                      </svg>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
