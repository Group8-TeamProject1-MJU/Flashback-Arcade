import React, { Component } from 'react';

const ROWS = 10;
const COLS = 10;
const CELL_SIZE = 20;
const UP = 'UP';
const DOWN = 'DOWN';
const LEFT = 'LEFT';
const RIGHT = 'RIGHT';

class SnakeGame extends Component {
  constructor() {
    super();
    this.state = {
      snake: [{ row: 5, col: 5 }],
      direction: RIGHT,
      food: this.randomFoodPosition(),
    };
    this.intervalId = null;
  }

  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyDown);
    this.intervalId = setInterval(this.moveSnake, 100);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyDown);
    clearInterval(this.intervalId);
  }

  randomFoodPosition = () => {
    const row = Math.floor(Math.random() * ROWS);
    const col = Math.floor(Math.random() * COLS);
    return { row, col };
  };

  handleKeyDown = (event) => {
    switch (event.key) {
      case 'ArrowUp':
        this.setState({ direction: UP });
        break;
      case 'ArrowDown':
        this.setState({ direction: DOWN });
        break;
      case 'ArrowLeft':
        this.setState({ direction: LEFT });
        break;
      case 'ArrowRight':
        this.setState({ direction: RIGHT });
        break;
      default:
        break;
    }
  };

  moveSnake = () => {
    const { snake, direction, food } = this.state;
    const newSnake = [...snake];
    let head = { ...newSnake[0] };

    switch (direction) {
      case UP:
        head.row -= 1;
        break;
      case DOWN:
        head.row += 1;
        break;
      case LEFT:
        head.col -= 1;
        break;
      case RIGHT:
        head.col += 1;
        break;
      default:
        break;
    }

    newSnake.unshift(head);

    if (head.row === food.row && head.col === food.col) {
      const newFood = this.randomFoodPosition();
      this.setState({ snake: newSnake, food: newFood });
    } else {
      newSnake.pop();
      this.setState({ snake: newSnake });
    }
  };

  render() {
    const { snake, food } = this.state;

    return (
      <div className="d-flex justify-content-center mb-4">
        <div>
          <h1>Snake Game</h1>
          <div
            style={{
              width: COLS * CELL_SIZE,
              height: ROWS * CELL_SIZE,
              border: '1px solid #000',
              display: 'grid',
              gridTemplateRows: `repeat(${ROWS}, ${CELL_SIZE}px)`,
              gridTemplateColumns: `repeat(${COLS}, ${CELL_SIZE}px)`,
            }}
          >
            {Array.from({ length: ROWS * COLS }, (_, i) => {
              const row = Math.floor(i / COLS);
              const col = i % COLS;
              const isSnakeSegment = snake.some(
                (segment) => segment.row === row && segment.col === col
              );
              const isFood = food.row === row && food.col === col;

              return (
                <div
                  key={i}
                  style={{
                    width: CELL_SIZE,
                    height: CELL_SIZE,
                    backgroundColor: isSnakeSegment
                      ? 'green'
                      : isFood
                        ? 'red'
                        : 'white',
                    border: '1px solid #ccc',
                  }}
                ></div>
              );
            })}
          </div>
        </div>
      </div>

    );
  }
}

export default SnakeGame;
