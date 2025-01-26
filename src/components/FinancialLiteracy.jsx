import { useState } from 'react';

export default function FinancialLiteracy() {
  const [quizScore, setQuizScore] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]); // Track user's answers
  const [showResults, setShowResults] = useState(false); // Toggle quiz results

  const questions = [
    {
      question: "What is a budget?",
      options: ["A plan for spending money", "A type of investment", "A savings account"],
      answer: "A plan for spending money",
    },
    {
      question: "What is compound interest?",
      options: ["Interest on interest", "A type of loan", "A tax deduction"],
      answer: "Interest on interest",
    },
  ];

  // Handle user's answer selection
  const handleAnswerSelect = (questionIndex, selectedAnswer) => {
    const newAnswers = [...userAnswers];
    newAnswers[questionIndex] = selectedAnswer;
    setUserAnswers(newAnswers);
  };

  // Calculate quiz score and show results
  const handleQuizSubmit = () => {
    const score = userAnswers.filter((answer, index) => answer === questions[index].answer).length;
    setQuizScore(score);
    setShowResults(true);
  };

  return (
    <div className="financial-literacy">
      <h3>Financial Literacy</h3>
      <div className="content">
        <p>Learn about budgeting, saving, and investing.</p>
        <a href="https://www.investopedia.com/financial-literacy-5075557" target="_blank" rel="noopener noreferrer">
          Read more
        </a>
      </div>
      <div className="quiz">
        <h4>Quiz</h4>
        {questions.map((question, index) => (
          <div key={index} className="question">
            <p>{question.question}</p>
            {question.options.map((option, i) => (
              <label key={i}>
                <input
                  type="radio"
                  name={`question-${index}`}
                  value={option}
                  onChange={() => handleAnswerSelect(index, option)}
                  disabled={showResults} // Disable inputs after submission
                />
                {option}
              </label>
            ))}
            {showResults && (
              <p className="answer-feedback">
                Correct Answer: <strong>{question.answer}</strong>
              </p>
            )}
          </div>
        ))}
        <button onClick={handleQuizSubmit} disabled={showResults}>
          Submit Quiz
        </button>
        {showResults && (
          <p className="quiz-score">
            Your score: <strong>{quizScore}/{questions.length}</strong>
          </p>
        )}
      </div>
    </div>
  );
}