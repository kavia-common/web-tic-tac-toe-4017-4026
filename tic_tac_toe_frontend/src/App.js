import React, { useState, useEffect } from 'react';
import './App.css';

/**
 * TicTacToe Game Board component
 * Renders the 3x3 grid, handles user moves, victory/draw logic and UI.
 */

// Theme colors from style guide
const PRIMARY_COLOR = '#3b82f6';
const SUCCESS_COLOR = '#06b6d4';
const SURFACE_COLOR = '#ffffff';
const BORDER_COLOR = '#dbeafe'; // subtle border
const HOVER_COLOR = '#e0f2fe';
const GRID_SHADOW = '0 8px 32px 0 rgba(31, 38, 135, 0.07)';

// Helper: Checks for winning combos on the board
function calculateWinner(squares) {
  const lines = [
    // Rows
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    // Columns
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    // Diagonals
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let line of lines) {
    const [a, b, c] = line;
    if (
      squares[a] &&
      squares[a] === squares[b] &&
      squares[a] === squares[c]
    ) {
      return { winner: squares[a], line };
    }
  }
  return null;
}

// PUBLIC_INTERFACE
function App() {
  const [theme, setTheme] = useState('light');
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [isGameOver, setIsGameOver] = useState(false);
  const [winner, setWinner] = useState(null);
  const [winningLine, setWinningLine] = useState(null);

  // Effect to apply light/dark theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Check winner or draw after each move
  useEffect(() => {
    const result = calculateWinner(squares);
    if (result) {
      setIsGameOver(true);
      setWinner(result.winner);
      setWinningLine(result.line);
    } else if (squares.every(sq => sq)) {
      setIsGameOver(true);
      setWinner(null);
      setWinningLine(null);
    }
  }, [squares]);

  // PUBLIC_INTERFACE
  const handleSquareClick = idx => {
    if (squares[idx] || isGameOver) return;
    const nextSquares = squares.slice();
    nextSquares[idx] = xIsNext ? 'X' : 'O';
    setSquares(nextSquares);
    setXIsNext(!xIsNext);
  };

  // PUBLIC_INTERFACE
  const handleReset = () => {
    setSquares(Array(9).fill(null));
    setXIsNext(true);
    setIsGameOver(false);
    setWinner(null);
    setWinningLine(null);
  };

  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  // Helper for rendering X/O with style
  function renderMark(value, highlight) {
    if (!value) return '';
    const color = highlight
      ? SUCCESS_COLOR
      : value === 'X'
        ? PRIMARY_COLOR
        : SUCCESS_COLOR;
    return (
      <span
        style={{
          color,
          fontWeight: 800,
          fontSize: '2.5rem',
          textShadow: highlight
            ? `0 0 8px ${color}44`
            : 'none',
          transition: 'color 0.2s',
        }}
      >
        {value}
      </span>
    );
  }

  // Render the 3x3 grid
  function Board() {
    return (
      <div className="ttt-board" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 64px)',
        gridTemplateRows: 'repeat(3, 64px)',
        gap: '12px',
        justifyContent: 'center',
        alignItems: 'center',
        background: SURFACE_COLOR,
        borderRadius: '16px',
        boxShadow: GRID_SHADOW,
        padding: '24px 24px 16px',
      }}>
        {squares.map((val, idx) => {
          const isWinning =
            winningLine && winningLine.indexOf(idx) !== -1;
          return (
            <button
              key={idx}
              className="ttt-cell"
              type="button"
              style={{
                width: '64px',
                height: '64px',
                background: isWinning ? `${SUCCESS_COLOR}1A` : SURFACE_COLOR,
                border: `2px solid ${BORDER_COLOR}`,
                borderRadius: '12px',
                outline: 'none',
                fontSize: '2.5rem',
                fontWeight: 700,
                cursor: squares[idx] || isGameOver ? 'default' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background 0.15s, border 0.15s',
                boxShadow: isWinning ? `0 0 0 2px ${SUCCESS_COLOR}` : 'none',
                userSelect: 'none',
              }}
              aria-label={
                squares[idx]
                  ? `Square ${idx + 1}, ${squares[idx]}`
                  : `Square ${idx + 1}, empty`
              }
              disabled={!!squares[idx] || isGameOver}
              onClick={() => handleSquareClick(idx)}
              tabIndex={0}
              onKeyPress={e => {
                if (
                  !squares[idx] &&
                  !isGameOver &&
                  (e.key === 'Enter' || e.key === ' ')
                ) {
                  handleSquareClick(idx);
                }
              }}
            >
              {renderMark(val, isWinning)}
            </button>
          );
        })}
      </div>
    );
  }

  // Game status message (current player, win, or draw)
  let statusMsg;
  if (winner) {
    statusMsg = (
      <span>
        <span style={{
          color: winner === 'X' ? PRIMARY_COLOR : SUCCESS_COLOR,
          fontWeight: 700
        }}>
          {winner}
        </span>
        &nbsp;wins! 🎉
      </span>
    );
  } else if (isGameOver && !winner) {
    statusMsg = <span style={{ color: '#64748b' }}>It's a draw.</span>;
  } else {
    statusMsg = (
      <span>
        Next player:&nbsp;
        <span style={{
          color: xIsNext ? PRIMARY_COLOR : SUCCESS_COLOR,
          fontWeight: 700,
          transition: 'color 0.2s'
        }}>
          {xIsNext ? 'X' : 'O'}
        </span>
      </span>
    );
  }

  // Render App
  return (
    <div className="App">
      <header className="App-header" style={{
        minHeight: '100vh',
        padding: 0,
        margin: 0,
        background: 'var(--bg-secondary)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          style={{
            backgroundColor: PRIMARY_COLOR,
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            fontWeight: 600,
            fontSize: 14,
            position: 'absolute',
            top: 16,
            right: 16,
            transition: 'background 0.2s'
          }}
        >
          {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
        </button>
        <div style={{ marginBottom: '32px', textAlign: 'center' }}>
          <h1 style={{
            color: PRIMARY_COLOR,
            fontSize: '2.2rem',
            margin: '10px 0 0',
            fontWeight: 800,
            letterSpacing: '-2px'
          }}>
            Tic Tac Toe
          </h1>
          <div style={{ color: '#6b7280', fontSize: '1rem' }}>
            A simple React game • <span style={{ color: SUCCESS_COLOR, fontWeight: 600 }}>X</span> & <span style={{ color: PRIMARY_COLOR, fontWeight: 600 }}>O</span>
          </div>
        </div>
        <div style={{ marginBottom: '16px', minHeight: '36px', fontSize: '1.2rem', fontWeight: 500 }}>
          {statusMsg}
        </div>
        <Board />
        <div style={{ marginTop: '28px' }}>
          <button
            className="ttt-reset"
            style={{
              background: isGameOver ? SUCCESS_COLOR : PRIMARY_COLOR,
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              padding: '12px 32px',
              fontSize: '1.1rem',
              fontWeight: 700,
              boxShadow: '0 2px 4px rgba(0,0,0,.04)',
              cursor: 'pointer',
              outline: 'none',
              letterSpacing: '.02em',
              transition: 'background 0.2s, transform 0.15s',
              margin: '0 auto'
            }}
            onClick={handleReset}
            aria-label="Restart game"
          >
            {isGameOver ? 'New Game' : 'Reset'}
          </button>
        </div>
        <footer style={{ marginTop: 32, color: '#94a3b8', fontSize: '0.9rem' }}>
          Built with React · Light Theme · #3b82f6 & #06b6d4 accents
        </footer>
      </header>
    </div>
  );
}

export default App;
