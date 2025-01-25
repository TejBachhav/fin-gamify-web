import { useState } from 'react';

export default function FinancialLiteracy() {
  const [quizScore, setQuizScore] = useState(0);

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

  const handleQuizSubmit = (answers) => {
    const score = answers.filter((answer, index) => answer === questions[index].answer).length;
    setQuizScore(score);
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
          <div key={index}>
            <p>{question.question}</p>
            {question.options.map((option, i) => (
              <label key={i}>
                <input type="radio" name={`question-${index}`} value={option} />
                {option}
              </label>
            ))}
          </div>
        ))}
        <button onClick={() => handleQuizSubmit(questions.map((q) => q.answer))}>
          Submit Quiz
        </button>
        <p>Your score: {quizScore}/{questions.length}</p>
      </div>
    </div>
  );
}