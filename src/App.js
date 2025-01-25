import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { db, auth } from './firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import Auth from './components/Auth';
import BudgetGame from './components/BudgetGame';
import ExpenseTracker from './components/ExpenseTracker';
import FinancialLiteracy from './components/FinancialLiteracy';
import FinancialAdvisor from './components/FinancialAdvisor';
import './App.css';

function App() {
  const [expenses, setExpenses] = useState([]);
  const [points, setPoints] = useState(0);

  useEffect(() => {
    if (auth.currentUser) {
      const userRef = doc(db, 'users', auth.currentUser.uid);
      const unsubscribe = onSnapshot(userRef, (doc) => {
        if (doc.exists()) {
          setExpenses(doc.data().expenses || []);
          setPoints(doc.data().points || 0);
        }
      });
      return () => unsubscribe();
    }
  }, []);

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Auth />} />
          <Route path="/dashboard" element={
            <>
              <BudgetGame />
              <ExpenseTracker expenses={expenses} points={points} />
              <FinancialLiteracy />
              <FinancialAdvisor />
            </>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;