import { useState } from 'react';
import { db, auth } from '../firebase';
import { doc, updateDoc } from 'firebase/firestore';

export default function ExpenseTracker({ expenses, points }) { // Ensure `export default` is used
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food');

  const addExpense = async (e) => {
    e.preventDefault();
    try {
      const userRef = doc(db, 'users', auth.currentUser.uid);
      await updateDoc(userRef, {
        expenses: [...expenses, {
          amount: Number(amount),
          category,
          date: new Date().toISOString(),
        }],
        points: points + 10,
      });
      setAmount('');
    } catch (error) {
      console.error("Error adding expense:", error);
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
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="Food">Food</option>
          <option value="Transport">Transport</option>
          <option value="Entertainment">Entertainment</option>
        </select>
        <button type="submit">Add Expense (+10 points)</button>
      </form>
    </div>
  );
}