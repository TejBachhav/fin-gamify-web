import { useState, useEffect } from 'react';

export default function FinancialLiteracy() {
  const [quizScore, setQuizScore] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]); // Track user's answers
  const [showResults, setShowResults] = useState(false); // Toggle quiz results
  const [timeLeft, setTimeLeft] = useState(300); // 5-minute timer (300 seconds)
  const [isTimerRunning, setIsTimerRunning] = useState(true); // Control timer state

  const questions = [
    {
      question: "Which of the following is the primary function of insurance?",
      options: ["Making risk disappear", "Pooling and sharing risk among the insured", "Making someone else pay for an accident or loss"],
      answer: "Pooling and sharing risk among the insured",
    },
    {
      question: "What is a budget?",
      options: ["A spending plan showing sources and uses of income", "A limit on spending that cannot be exceeded", "Credit card amount without penalty"],
      answer: "A spending plan showing sources and uses of income",
    },
    {
      question: "Which of the following would hurt your credit score?",
      options: ["Closing a long-held credit card account", "Paying off student loan debt", "Getting married"],
      answer: "Closing a long-held credit card account",
    },
  ];

  // Timer logic
  useEffect(() => {
    if (isTimerRunning && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      handleQuizSubmit(); // Automatically submit quiz when time runs out
    }
  }, [timeLeft, isTimerRunning]);

  // Format time (MM:SS)
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  // Handle user's answer selection
  const handleAnswerSelect = (questionIndex, selectedAnswer) => {
    const newAnswers = [...userAnswers];
    newAnswers[questionIndex] = selectedAnswer;
    setUserAnswers(newAnswers);
  };

  // Calculate quiz score and show results
  const handleQuizSubmit = () => {
    setIsTimerRunning(false); // Stop the timer
    const score = userAnswers.filter((answer, index) => answer === questions[index].answer).length;
    setQuizScore(score);
    setShowResults(true);
    saveResults(score); // Save results to localStorage
  };

  // Save quiz results to localStorage
  const saveResults = (score) => {
    const result = {
      date: new Date().toLocaleString(),
      score: `${score}/${questions.length}`,
    };
    const savedResults = JSON.parse(localStorage.getItem('quizResults') || '[]');
    savedResults.push(result);
    localStorage.setItem('quizResults', JSON.stringify(savedResults));
  };

  // Progress calculation
  const progress = ((userAnswers.filter(Boolean).length / questions.length) * 100).toFixed(0);

  return (
    <div style={styles.container}>
      <h3 style={styles.heading}>Financial Literacy</h3>
      <div style={styles.content}>
        <p>Learn about budgeting, saving, and investing.</p>
        <a
          href="https://www.investopedia.com/financial-literacy-5075557"
          target="_blank"
          rel="noopener noreferrer"
          style={styles.link}
        >
          Read more
        </a>
      </div>
      <div style={styles.quiz}>
        <div style={styles.quizHeader}>
          <h4 style={styles.quizHeading}>Quiz</h4>
          <p style={styles.timer}>Time Left: {formatTime(timeLeft)}</p>
        </div>
        <div style={styles.progressBar}>
          <div style={{ ...styles.progressFill, width: `${progress}%` }}></div>
        </div>
        {questions.map((question, index) => (
          <div key={index} style={styles.question}>
            <p style={styles.questionText}>
              <strong>{index + 1}. {question.question}</strong>
            </p>
            {question.options.map((option, i) => (
              <label key={i} style={styles.option}>
                <input
                  type="radio"
                  name={`question-${index}`}
                  value={option}
                  onChange={() => handleAnswerSelect(index, option)}
                  disabled={showResults} // Disable inputs after submission
                  style={styles.radio}
                />
                <strong>{String.fromCharCode(65 + i)}. {option}</strong>
              </label>
            ))}
            {showResults && (
              <p style={styles.answerFeedback}>
                Correct Answer: <strong>{question.answer}</strong>
              </p>
            )}
          </div>
        ))}
        <button
          onClick={handleQuizSubmit}
          disabled={showResults}
          style={styles.button}
        >
          Submit Quiz
        </button>
        {showResults && (
          <p style={styles.quizScore}>
            Your score: <strong>{quizScore}/{questions.length}</strong>
          </p>
        )}
      </div>
    </div>
  );
}

// Inline styles for the component
const styles = {
  container: {
    backgroundColor: '#f9f9f9',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    maxWidth: '600px',
    margin: '0 auto',
    fontFamily: 'Arial, sans-serif',
  },
  heading: {
    fontSize: '24px',
    marginBottom: '20px',
    textAlign: 'center',
    color: '#333',
  },
  content: {
    marginBottom: '20px',
    textAlign: 'center',
  },
  link: {
    color: '#007bff',
    textDecoration: 'none',
  },
  quiz: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  quizHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '15px',
  },
  quizHeading: {
    fontSize: '20px',
    color: '#333',
  },
  timer: {
    fontSize: '16px',
    color: '#dc3545',
  },
  progressBar: {
    width: '100%',
    height: '10px',
    backgroundColor: '#e9ecef',
    borderRadius: '5px',
    marginBottom: '20px',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#007bff',
    borderRadius: '5px',
    transition: 'width 0.3s ease',
  },
  question: {
    marginBottom: '20px',
    textAlign: 'left',
  },
  questionText: {
    fontSize: '16px',
    marginBottom: '10px',
    color: '#555',
  },
  option: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '5px',
    fontSize: '14px',
    color: '#333',
  },
  radio: {
    marginRight: '10px',
  },
  answerFeedback: {
    marginTop: '10px',
    fontSize: '14px',
    color: '#28a745',
  },
  button: {
    padding: '10px 20px',
    borderRadius: '4px',
    border: 'none',
    backgroundColor: '#007bff',
    color: '#fff',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
    marginTop: '20px',
    width: '100%',
  },
  quizScore: {
    marginTop: '20px',
    fontSize: '18px',
    textAlign: 'center',
    color: '#333',
  },
};