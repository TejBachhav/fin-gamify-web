import { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';

export default function BudgetGame() {
  const [budget, setBudget] = useState(0);
  const [remainingBudget, setRemainingBudget] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch user data from Firestore
  useEffect(() => {
    if (auth.currentUser) {
      const budgetRef = doc(db, 'users', auth.currentUser.uid);
      const unsubscribe = onSnapshot(budgetRef, (doc) => {
        if (doc.exists()) {
          setBudget(doc.data().budget || 0);
          setRemainingBudget(doc.data().remainingBudget || 0);
        }
      });
      return () => unsubscribe();
    }
  }, []);

  // Update budget and remaining budget
  const updateBudget = async (newBudget) => {
    if (!newBudget || isNaN(newBudget) || Number(newBudget) <= 0) {
      setError('Please enter a valid budget amount.');
      return;
    }

    try {
      // Calculate the updated budget by adding the new budget to the existing budget
      const updatedBudget = budget + Number(newBudget);

      // Update Firestore with the new budget and remaining budget
      await updateDoc(doc(db, 'users', auth.currentUser.uid), {
        budget: updatedBudget,
        remainingBudget: remainingBudget + Number(newBudget), // Add to remaining budget as well
      });

      // Update local state
      setBudget(updatedBudget);
      setRemainingBudget(remainingBudget + Number(newBudget));

      // Clear error and show success message
      setError('');
      setSuccess('Budget updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Error updating budget:', error);
      setError('Failed to update budget. Please try again.');
    }
  };

  return (
    <div className="budget-game">
      <h3>Monthly Budget: ${budget}</h3>
      <h3>Remaining Budget: ${remainingBudget}</h3>
      <input
        type="number"
        value={budget}
        onChange={(e) => setBudget(e.target.value)}
        placeholder="Set monthly budget"
        min="0"
        step="0.01"
      />
      <button onClick={() => updateBudget(budget)}>
        Update Budget
      </button>

      {/* Display error or success messages */}
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}
    </div>
  );
}