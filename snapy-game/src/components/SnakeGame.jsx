import React, { useState, useEffect, useRef } from 'react';
import './SnakeGame.css';

const BOARD_SIZE = 20; // 20x20 cells
const CELL_SIZE = 20; // px
const INITIAL_SPEED = 200; // ms per move

const getRandomFood = (snake) => {
  let position;
  do {
    position = {
      x: Math.floor(Math.random() * BOARD_SIZE),
      y: Math.floor(Math.random() * BOARD_SIZE),
    };
  } while (snake.some(seg => seg.x === position.x && seg.y === position.y));
  return position;
};

export default function SnakeGame({ onScore }) {
  const [snake, setSnake] = useState([
    { x: 9, y: 9 },
    { x: 8, y: 9 },
    { x: 7, y: 9 },
  ]);
  const [direction, setDirection] = useState({ x: 1, y: 0 });
  const [food, setFood] = useState(() => getRandomFood([{ x: 9, y: 9 }, { x: 8, y: 9 }, { x: 7, y: 9 }]));
  const [speed, setSpeed] = useState(INITIAL_SPEED);
  const [gameOver, setGameOver] = useState(false);
  
  const boardRef = useRef(null);

  // Use refs to store the latest state for the interval callback
  const snakeRef = useRef(snake);
  const directionRef = useRef(direction);
  const foodRef = useRef(food);
  const gameOverRef = useRef(gameOver);

  useEffect(() => { snakeRef.current = snake; }, [snake]);
  useEffect(() => { directionRef.current = direction; }, [direction]);
  useEffect(() => { foodRef.current = food; }, [food]);
  useEffect(() => { gameOverRef.current = gameOver; }, [gameOver]);

  // Keyboard handling
  useEffect(() => {
    const handleKey = (e) => {
      if (gameOverRef.current) return;
      const dir = directionRef.current;
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (dir.y !== 1) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          if (dir.y !== -1) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (dir.x !== 1) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (dir.x !== -1) setDirection({ x: 1, y: 0 });
          break;
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  // Game loop
  useEffect(() => {
    if (gameOver) return;
    const interval = setInterval(() => {
      if (gameOverRef.current) return;

      const currentSnake = snakeRef.current;
      const currentDir = directionRef.current;
      const currentFood = foodRef.current;

      const newHead = {
        x: (currentSnake[0].x + currentDir.x + BOARD_SIZE) % BOARD_SIZE,
        y: (currentSnake[0].y + currentDir.y + BOARD_SIZE) % BOARD_SIZE,
      };

      // Check self-collision
      if (currentSnake.some(seg => seg.x === newHead.x && seg.y === newHead.y)) {
        setGameOver(true);
        return;
      }

      const newSnake = [newHead, ...currentSnake];

      // Eat food
      if (newHead.x === currentFood.x && newHead.y === currentFood.y) {
        setFood(getRandomFood(newSnake));
        setSpeed(s => Math.max(50, s - 5));
        setSnake(newSnake);
        if (onScore) onScore((newSnake.length - 3) * 10);
      } else {
        newSnake.pop(); // remove tail
        setSnake(newSnake);
      }
    }, speed);
    return () => clearInterval(interval);
  }, [speed, gameOver, onScore]);

  const resetGame = () => {
    const initSnake = [
      { x: 9, y: 9 },
      { x: 8, y: 9 },
      { x: 7, y: 9 },
    ];
    setSnake(initSnake);
    setDirection({ x: 1, y: 0 });
    setFood(getRandomFood(initSnake));
    setSpeed(INITIAL_SPEED);
    setGameOver(false);
    if (onScore) onScore(0);
  };

  return (
    <div className="snake-game">
      <div
        className="board"
        style={{
          width: BOARD_SIZE * CELL_SIZE,
          height: BOARD_SIZE * CELL_SIZE,
        }}
        ref={boardRef}
      >
        {Array.from({ length: BOARD_SIZE }).map((_, row) =>
          Array.from({ length: BOARD_SIZE }).map((_, col) => {
            const isSnake = snake.some(seg => seg.x === col && seg.y === row);
            const isFood = food.x === col && food.y === row;
            const cellClass = isSnake ? 'cell snake' : isFood ? 'cell food' : 'cell';
            return <div key={`${row}-${col}`} className={cellClass} style={{ width: CELL_SIZE, height: CELL_SIZE }} />;
          })
        )}
      </div>
      {gameOver && (
        <div className="overlay">
          <div className="game-over">Game Over</div>
          <button onClick={resetGame}>Play Again</button>
        </div>
      )}
    </div>
  );
}
