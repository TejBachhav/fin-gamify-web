import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { db, auth } from './firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import Auth from './components/Auth';
import Dashboard from './pages/Dashboard';
import QuizPage from './pages/QuizPage'; // Import QuizPage
import ChatbotPage from './pages/ChatbotPage'; // Import ChatbotPage
import './App.css';

function App() {
  const [loading, setLoading] = useState(true);

  // Check if user is logged in
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="loading-spinner">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Auth />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/quiz" element={<QuizPage />} /> {/* Add QuizPage route */}
          <Route path="/chatbot" element={<ChatbotPage />} /> {/* Add ChatbotPage route */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;