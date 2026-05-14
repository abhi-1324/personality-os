import React, { useState } from 'react';
import './App.css';

const questions = [
  "What do you do when nobody is watching?",
  "What would you do if money didn't exist?",
  "What's the last thing that made you cry and why?",
  "What do you pretend not to care about but actually do?",
  "When do you feel most like yourself?",
  "What's something you know is holding you back?",
  "What do people always get wrong about you?",
  "What would your 10 year old self think of you now?",
  "What are you most afraid to admit about yourself?",
  "What do you want your life to feel like, not look like?"
];

function App() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleNext() {
    if (currentQuestion < questions.length - 1) {
      setAnswers([...answers, currentAnswer]);
      setCurrentAnswer("");
      setCurrentQuestion(currentQuestion + 1);
    } else {
      const finalAnswers = [...answers, currentAnswer];
      setAnswers(finalAnswers);
      setLoading(true);

      const prompt = questions.map((q, i) =>
        `Q: ${q}\nA: ${finalAnswers[i]}`
      ).join("\n\n");

      const response = await fetch("http://localhost:3000/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: prompt })
      });

      const data = await response.json();
      setResult(data.result);
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="app">
       <p className="loading">Analyzing your soul... 🔮</p>
      </div>
   );
  }

  if (result) {
    return (
      <div className="app">
        <h1 className="result-title">🧬 Personality OS</h1>
        <div className="result-content">{result}</div>
      </div>
    );
  }

  return (
    <div className="app">
      <p className="progress">{currentQuestion + 1} of {questions.length}</p>
      <h2 className="question">{questions[currentQuestion]}</h2>
      <textarea
        value={currentAnswer}
        onChange={(e) => setCurrentAnswer(e.target.value)}
        placeholder="Be honest. Nobody's watching."
      />
      <button onClick={handleNext}>
        {currentQuestion === questions.length - 1 ? "Reveal My Personality OS 🧬" : "Next →"}
      </button>
    </div>
  );
}

export default App;