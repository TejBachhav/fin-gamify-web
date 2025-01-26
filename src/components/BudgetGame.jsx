import { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { doc, setDoc, onSnapshot } from 'firebase/firestore';

export default function BudgetGame() {
  const [budget, setBudget] = useState(0);
  const [points, setPoints] = useState(0);
  const [error, setError] = useState(''); // For error messages
  const [success, setSuccess] = useState(''); // For success messages

  // Fetch user data from Firestore
  useEffect(() => {
    if (auth.currentUser) {
      const budgetRef = doc(db, 'users', auth.currentUser.uid);
      const unsubscribe = onSnapshot(budgetRef, (doc) => {
        if (doc.exists()) {
          setBudget(doc.data().budget || 0);
          setPoints(doc.data().points || 0);
        }
      });
      return () => unsubscribe();
    }
  }, []);

  // Update budget and award points
  const updateBudget = async (newBudget) => {
    // Validate input
    if (!newBudget || isNaN(newBudget) || Number(newBudget) <= 0) {
      setError('Please enter a valid budget amount.');
      return;
    }

    try {
      await setDoc(
        doc(db, 'users', auth.currentUser.uid),
        {
          budget: Number(newBudget),
          points: points + 50, // Award 50 points for updating the budget
        },
        { merge: true }
      );

      // Show success message
      setError('');
      setSuccess('Budget updated successfully!');

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Error updating budget:', error);
      setError('Failed to update budget. Please try again.');
    }
  };

  return (
    <div className="budget-game">
      <h3>Monthly Budget: ${budget}</h3>
      <div className="points">Points: {points}</div>
      <input
        type="number"
        value={budget}
        onChange={(e) => setBudget(e.target.value)}
        placeholder="Set monthly budget"
        min="0"
        step="0.01"
      />
      <button onClick={() => updateBudget(budget)}>
        Update Budget (+50 points)
      </button>

      {/* Display error or success messages */}
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}
    </div>
  );
}