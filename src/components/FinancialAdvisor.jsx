import { useState } from 'react';
import axios from 'axios';

export default function FinancialAdvisor() {
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/ai-advice', { message });
      setResponse(res.data.advice);
    } catch (error) {
      console.error("Error getting advice:", error);
    }
  };

  return (
    <div className="ai-advisor">
      <h3>Financial Advisor</h3>
      <form onSubmit={handleSubmit}>
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Ask financial question..."
        />
        <button type="submit">Ask</button>
      </form>
      {response && <div className="response">{response}</div>}
    </div>
  );
}