import React, { useState, useEffect, useRef } from 'react';
import SnakeGame from './components/SnakeGame';
import './App.css';

// Royalty-free Lofi background music
const BGM_URL = "https://cdn.pixabay.com/audio/2022/05/27/audio_1808fbf07a.mp3";

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

  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const audioRef = useRef(null);

  const toggleMusic = () => {
    if (isMusicPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsMusicPlaying(!isMusicPlaying);
  };

  useEffect(() => {
    document.title = `Snapy – Score ${score}`;
  }, [score]);

  return (
    <div className="app-container">
      <audio ref={audioRef} src={BGM_URL} loop preload="auto" />
      <header className="header">
        <div className="header-top">
          <h1>SNAPY</h1>
          <button className="music-toggle" onClick={toggleMusic} title="Toggle Music">
            {isMusicPlaying ? '🔊' : '🔇'}
          </button>
        </div>
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
