import { useState } from 'react';
import { db, auth } from '../firebase';
import { doc, updateDoc } from 'firebase/firestore';

export default function ExpenseTracker({ expenses, points }) {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food');
  const [error, setError] = useState(''); // For error messages
  const [success, setSuccess] = useState(''); // For success messages

  const addExpense = async (e) => {
    e.preventDefault();

    // Validate input
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      setError('Please enter a valid amount.');
      return;
    }

    try {
      const userRef = doc(db, 'users', auth.currentUser.uid);
      await updateDoc(userRef, {
        expenses: [
          ...expenses,
          {
            amount: Number(amount),
            category,
            date: new Date().toISOString(),
          },
        ],
        points: points + 10, // Award 10 points for adding an expense
      });

      // Reset form and show success message
      setAmount('');
      setCategory('Food');
      setError('');
      setSuccess('Expense added successfully!');

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Error adding expense:', error);
      setError('Failed to add expense. Please try again.');
    }
  };

  return (
    <div className="expense-tracker">
      <h3>Add Expense</h3>
      <form onSubmit={addExpense}>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount"
          min="0"
          step="0.01"
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="Food">Food</option>
          <option value="Transport">Transport</option>
          <option value="Entertainment">Entertainment</option>
        </select>
        <button type="submit">Add Expense (+10 points)</button>
      </form>

      {/* Display error or success messages */}
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}
    </div>
  );
}