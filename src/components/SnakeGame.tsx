import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Trophy, RefreshCw, Play, Pause } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION = { x: 0, y: -1 };
const SPEED = 150;

export default function SnakeGame() {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [isPaused, setIsPaused] = useState(true);
  
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);

  const generateFood = useCallback(() => {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      // Check if food is on snake
      const onSnake = snake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
      if (!onSnake) break;
    }
    setFood(newFood);
  }, [snake]);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setGameOver(false);
    setScore(0);
    setIsPaused(false);
    generateFood();
  };

  const moveSnake = useCallback(() => {
    if (gameOver || isPaused) return;

    setSnake(prevSnake => {
      const head = prevSnake[0];
      const newHead = {
        x: (head.x + direction.x + GRID_SIZE) % GRID_SIZE,
        y: (head.y + direction.y + GRID_SIZE) % GRID_SIZE,
      };

      // Check collision with self
      if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        setGameOver(true);
        setIsPaused(true);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Check food
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore(s => s + 10);
        generateFood();
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, gameOver, isPaused, generateFood]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          if (direction.y === 0) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
          if (direction.y === 0) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
          if (direction.x === 0) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
          if (direction.x === 0) setDirection({ x: 1, y: 0 });
          break;
        case ' ':
          setIsPaused(p => !p);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  useEffect(() => {
    if (!isPaused && !gameOver) {
      gameLoopRef.current = setInterval(moveSnake, SPEED);
    } else {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    }
    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [isPaused, gameOver, moveSnake]);

  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
    }
  }, [score, highScore]);

  return (
    <div className="flex flex-col items-center gap-6 p-8 bg-black/40 backdrop-blur-xl rounded-3xl border border-cyan-500/30 shadow-[0_0_50px_-12px_rgba(6,182,212,0.5)]">
      <div className="flex justify-between w-full px-4">
        <div className="flex items-center gap-3">
          <Trophy className="w-6 h-6 text-yellow-400 drop-shadow-[0_0_12px_rgba(250,204,21,0.8)]" />
          <span className="text-cyan-400 font-digital text-3xl font-black tracking-widest animate-glitch">
            SCORE: {score}
          </span>
        </div>
        <div className="text-cyan-400/60 font-mono text-sm">HI-SCORE: {highScore}</div>
      </div>

      <div 
        className="relative bg-black border-4 border-cyan-500/50 rounded-lg overflow-hidden shadow-[inset_0_0_20px_rgba(6,182,212,0.2)]"
        style={{ 
          width: GRID_SIZE * 20, 
          height: GRID_SIZE * 20,
          display: 'grid',
          gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
          gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`
        }}
      >
        {/* Food */}
        <div 
          className="absolute w-5 h-5 bg-rose-500 rounded-full shadow-[0_0_15px_#f43f5e] animate-pulse"
          style={{ 
            left: food.x * 20, 
            top: food.y * 20,
            transition: 'all 0.1s ease-out'
          }}
        />

        {/* Snake */}
        {snake.map((segment, i) => (
          <div 
            key={i}
            className={`absolute w-5 h-5 rounded-sm ${i === 0 ? 'bg-cyan-400 z-10' : 'bg-cyan-600/80'}`}
            style={{ 
              left: segment.x * 20, 
              top: segment.y * 20,
              boxShadow: i === 0 ? '0 0 15px #22d3ee' : 'none',
              transition: 'all 0.1s ease-out'
            }}
          />
        ))}

        {/* Game Over Overlay */}
        <AnimatePresence>
          {gameOver && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-20"
            >
              <h2 className="text-rose-500 text-4xl font-bold mb-4 tracking-tighter">GAME OVER</h2>
              <button 
                onClick={resetGame}
                className="flex items-center gap-2 px-6 py-3 bg-cyan-500 text-black font-bold rounded-full hover:bg-cyan-400 transition-colors"
              >
                <RefreshCw className="w-5 h-5 drop-shadow-[0_0_8px_rgba(0,0,0,0.5)]" />
                TRY AGAIN
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pause Overlay */}
        <AnimatePresence>
          {isPaused && !gameOver && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center z-20 backdrop-blur-sm"
            >
              <button 
                onClick={() => setIsPaused(false)}
                className="w-16 h-16 bg-cyan-500 text-black rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-[0_0_30px_rgba(6,182,212,0.5)]"
              >
                <Play className="w-8 h-8 fill-current drop-shadow-[0_0_15px_rgba(0,0,0,0.5)]" />
              </button>
              <p className="mt-4 text-cyan-400 font-mono text-sm animate-pulse">PRESS SPACE TO START</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex gap-4">
        <button 
          onClick={() => setIsPaused(!isPaused)}
          className="p-3 rounded-full border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 transition-colors"
        >
          {isPaused ? <Play className="w-6 h-6 drop-shadow-[0_0_8px_rgba(34,211,238,0.6)]" /> : <Pause className="w-6 h-6 drop-shadow-[0_0_8px_rgba(34,211,238,0.6)]" />}
        </button>
        <button 
          onClick={resetGame}
          className="p-3 rounded-full border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 transition-colors"
        >
          <RefreshCw className="w-6 h-6 drop-shadow-[0_0_8px_rgba(34,211,238,0.6)]" />
        </button>
      </div>

      <div className="text-cyan-400/40 text-[10px] font-mono uppercase tracking-[0.2em]">
        Use arrow keys to move • Space to pause
      </div>
    </div>
  );
}
