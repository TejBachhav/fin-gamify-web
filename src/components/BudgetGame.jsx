import { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { doc, setDoc, onSnapshot } from 'firebase/firestore';

export default function BudgetGame() { // Ensure `export default` is used
  const [budget, setBudget] = useState(0);
  const [points, setPoints] = useState(0);

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

  const updateBudget = async (newBudget) => {
    try {
      await setDoc(doc(db, 'users', auth.currentUser.uid), {
        budget: newBudget,
        points: points + 50,
      }, { merge: true });
    } catch (error) {
      console.error("Error updating budget:", error);
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
      />
      <button onClick={() => updateBudget(Number(budget))}>
        Update Budget (+50 points)
      </button>
    </div>
  );
}