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
    <div className="expense-tracker" style={styles.container}>
      <h3 style={styles.heading}>Add Expense</h3>
      <form onSubmit={addExpense} style={styles.form}>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount"
          min="0"
          step="0.01"
          style={styles.input}
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={styles.select}
        >
          <option value="Food">Food</option>
          <option value="Transport">Transport</option>
          <option value="Entertainment">Entertainment</option>
        </select>
        <button type="submit" style={styles.button}>
          Add Expense
        </button>
      </form>

      {/* Display error or success messages */}
      {error && <p style={styles.errorMessage}>{error}</p>}
      {success && <p style={styles.successMessage}>{success}</p>}
    </div>
  );
}

// Styles for the component
const styles = {
  container: {
    backgroundColor: '#f9f9f9',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    maxWidth: '400px',
    margin: '0 auto',
  },
  heading: {
    fontSize: '24px',
    marginBottom: '20px',
    textAlign: 'center',
    color: '#333',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  input: {
    padding: '10px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    fontSize: '16px',
  },
  select: {
    padding: '10px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    fontSize: '16px',
    backgroundColor: '#fff',
  },
  button: {
    padding: '10px',
    borderRadius: '4px',
    border: 'none',
    backgroundColor: '#007bff',
    color: '#fff',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
  buttonHover: {
    backgroundColor: '#0056b3',
  },
  errorMessage: {
    color: '#dc3545',
    textAlign: 'center',
    marginTop: '10px',
  },
  successMessage: {
    color: '#28a745',
    textAlign: 'center',
    marginTop: '10px',
  },
};