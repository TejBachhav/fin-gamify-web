import { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import BudgetGame from '../components/BudgetGame';
import ExpenseTracker from '../components/ExpenseTracker';
import ExpenseChart from '../components/ExpenseChart';
import './Dashboard.css'; // Add this for dashboard-specific styles

export default function Dashboard() {
  const [expenses, setExpenses] = useState([]);
  const [budget, setBudget] = useState(0);
  const [remainingBudget, setRemainingBudget] = useState(0);
  const [loading, setLoading] = useState(true);

  // Fetch user data from Firestore
  useEffect(() => {
    if (auth.currentUser) {
      const userRef = doc(db, 'users', auth.currentUser.uid);
      const unsubscribe = onSnapshot(userRef, (doc) => {
        if (doc.exists()) {
          setExpenses(doc.data().expenses || []);
          setBudget(doc.data().budget || 0);
          setRemainingBudget(doc.data().remainingBudget || 0);
        }
        setLoading(false);
      });
      return () => unsubscribe();
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div className="loading-spinner">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <h2>Dashboard</h2>
      <div className="dashboard-content">
        <div className="dashboard-left">
          <BudgetGame />
          <ExpenseTracker
            expenses={expenses}
            setExpenses={setExpenses}
            remainingBudget={remainingBudget}
            setRemainingBudget={setRemainingBudget}
          />
        </div>
        <div className="dashboard-right">
          <ExpenseChart expenses={expenses} />
        </div>
      </div>
    </div>
  );
}