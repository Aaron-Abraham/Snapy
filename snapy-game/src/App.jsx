import React, { useState, useEffect } from 'react';
import SnakeGame from './components/SnakeGame';
import './App.css';

function App() {
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(() => {
    const saved = localStorage.getItem('snapy_best');
    return saved ? parseInt(saved, 10) : 0;
  });

  const handleScore = (pts) => {
    setScore(pts);
    if (pts > best) {
      setBest(pts);
      localStorage.setItem('snapy_best', pts);
    }
  };

  useEffect(() => {
    document.title = `Snapy – Score ${score}`;
  }, [score]);

  return (
    <div className="app-container">
      <header className="header">
        <h1>SNAPY</h1>
        <div className="stats">
          <div className="stat">
            <span className="label">Score</span>
            <span className="value">{score}</span>
          </div>
          <div className="stat">
            <span className="label">Best</span>
            <span className="value">{best}</span>
          </div>
        </div>
      </header>
      <main className="game-area">
        <SnakeGame onScore={handleScore} />
      </main>
      <footer className="footer">
        <p>Use Arrow Keys or WASD to control the snake.</p>
      </footer>
    </div>
  );
}

export default App;
