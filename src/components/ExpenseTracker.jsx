import { useState } from 'react';
import { db, auth } from '../firebase';
import { doc, updateDoc } from 'firebase/firestore';

export default function ExpenseTracker({ expenses, setExpenses, remainingBudget, setRemainingBudget }) {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const addExpense = async (e) => {
    e.preventDefault();

    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      setError('Please enter a valid amount.');
      return;
    }

    if (Number(amount) > remainingBudget) {
      setError('Expense exceeds remaining budget.');
      return;
    }

    try {
      const userRef = doc(db, 'users', auth.currentUser.uid);
      const newExpense = {
        amount: Number(amount),
        category,
        date: new Date().toISOString(),
      };

      await updateDoc(userRef, {
        expenses: [...expenses, newExpense],
        remainingBudget: remainingBudget - Number(amount),
      });

      setAmount('');
      setCategory('Food');
      setError('');
      setSuccess('Expense added successfully!');
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
        <button type="submit">Add Expense</button>
      </form>

      {/* Display error or success messages */}
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}
    </div>
  );
}