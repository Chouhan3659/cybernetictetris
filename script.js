const canvas = document.getElementById('tetris');
const context = canvas.getContext('2d');
const startButton = document.getElementById('startButton');
const gameContainer = document.getElementById('gameContainer');
const currentScoreDisplay = document.getElementById('currentScore');
const highScoreDisplay = document.getElementById('highScore');
const timerDisplay = document.getElementById('timerDisplay');
const message = document.getElementById('message');
const backgroundMusic = document.getElementById('backgroundMusic');
const moveSound = document.getElementById('moveSound');
const rotateSound = document.getElementById('rotateSound');
const dropSound = document.getElementById('dropSound');
const mobileControls = document.getElementById('mobileControls');
const moveLeftButton = document.getElementById('moveLeft');
const moveRightButton = document.getElementById('moveRight');
const rotateButton = document.getElementById('rotate');
const dropButton = document.getElementById('drop');
const flirtyMessages = document.getElementById('flirtyMessages');
const loadingScreen = document.getElementById('loadingScreen');
const container = document.querySelector('.container');

const ROWS = 20;
const COLS = 10;
const BLOCK_SIZE = 30;
const COLORS = ['#00ff9f', '#00b8ff', '#001eff', '#bd00ff', '#d600ff'];

let score = 0;
let highScore = 0;
let timeLeft = 120; // 2 minutes in seconds
let timerInterval;
let gameInterval;

const board = Array.from({ length: ROWS }, () => Array(COLS).fill(0));

const shapes = [
  [[1, 1, 1, 1]], [[1, 1, 1],
   [0, 1, 0]],

  [[1, 1],
   [1, 1]],

  [[0, 1, 1],
   [1, 1, 0]],

  [[1, 1, 0],
   [0, 1, 1]],

  [[1, 0, 0],
   [1, 1, 1]],

  [[0, 0, 1],
   [1, 1, 1]],

  [[0, 1],
   [1, 1],
   [0, 1]]
];

let currentShape;
let currentPosition;

function startGame() {
  score = 0;
  timeLeft = 120;
  currentScoreDisplay.textContent = score;
  highScoreDisplay.textContent = highScore;
  gameContainer.classList.remove('hidden');
  loadingScreen.classList.add('hidden');
  backgroundMusic.play();
  generateNewShape();
  updateTimer();
  gameInterval = setInterval(updateGame, 1000);
}

function generateNewShape() {
  const randomIndex = Math.floor(Math.random() * shapes.length);
  currentShape = shapes[randomIndex];
  currentPosition = { x: Math.floor(COLS / 2) - 1, y: 0 };
  if (isCollision()) {
    clearInterval(gameInterval);
    message.classList.remove('hidden');
  }
}

function isCollision() {
  for (let row = 0; row < currentShape.length; row++) {
    for (let col = 0; col < currentShape[row].length; col++) {
      if (currentShape[row][col] && 
          (board[currentPosition.y + row] && 
          board[currentPosition.y + row][currentPosition.x + col]) !== 0) {
        return true;
      }
    }
  }
  return false;
}

function updateGame() {
  if (!isCollision()) {
    currentPosition.y++;
  } else {
    mergeShape();
    clearLines();
    generateNewShape();
  }
  draw();
}

function mergeShape() {
  currentShape.forEach((row, rowIndex) => {
    row.forEach((value, colIndex) => {
      if (value) {
        board[currentPosition.y + rowIndex][currentPosition.x + colIndex] = value;
      }
    });
  });
}

function clearLines() {
  for (let row = ROWS - 1; row >= 0; row--) {
    if (board[row].every(value => value !== 0)) {
      board.splice(row, 1);
      board.unshift(Array(COLS).fill(0));
      score += 10;
      currentScoreDisplay.textContent = score;
      if (score > highScore) {
        highScore = score;
        highScoreDisplay.textContent = highScore;
      }
    }
  }
}

function draw() {
  context.clearRect(0, 0, canvas.width, canvas.height);
  board.forEach((row, rowIndex) => {
    row.forEach((value, colIndex) => {
      if (value) {
        context.fillStyle = COLORS[value - 1];
        context.fillRect(colIndex * BLOCK_SIZE, rowIndex * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
      }
    });
  });
  currentShape.forEach((row, rowIndex) => {
    row.forEach((value, colIndex) => {
      if (value) {
        context.fillStyle = COLORS[value - 1];
        context.fillRect((currentPosition.x + colIndex) * BLOCK_SIZE, 
                         (currentPosition.y + rowIndex) * BLOCK_SIZE, 
                         BLOCK_SIZE, BLOCK_SIZE);
      }
    });
  });
}

function updateTimer() {
  timerInterval = setInterval(() => {
    timeLeft--;
    timerDisplay.textContent = `Time: ${Math.floor(timeLeft / 60)}:${timeLeft % 60 < 10 ? '0' : ''}${timeLeft % 60}`;
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      clearInterval(gameInterval);
      message.classList.remove('hidden');
    }
  }, 1000);
}

startButton.addEventListener('click', startGame);
moveLeftButton.addEventListener('click', () => {
  currentPosition.x--;
  if (isCollision()) currentPosition.x++;
});
moveRightButton.addEventListener('click', () => {
  currentPosition.x++;
  if (isCollision()) currentPosition.x--;
});
rotateButton.addEventListener('click', () => {
  currentShape = rotate(currentShape);
  if (isCollision()) currentShape = rotate(currentShape, true);
});
dropButton.addEventListener('click', () => {
  while (!isCollision()) {
    currentPosition.y++;
  }
  currentPosition.y--;
  mergeShape ();
  clearLines();
  generateNewShape();
});

function rotate(shape, reverse = false) {
  return shape[0].map((val, index) => shape.map(row => reverse ? row[row.length - 1 - index] : row[index])).reverse();
}

document.addEventListener('keydown', (event) => {
  switch (event.key) {
    case 'ArrowLeft':
      currentPosition.x--;
      if (isCollision()) currentPosition.x++;
      break;
    case 'ArrowRight':
      currentPosition.x++;
      if (isCollision()) currentPosition.x--;
      break;
    case 'ArrowUp':
      currentShape = rotate(currentShape);
      if (isCollision()) currentShape = rotate(currentShape, true);
      break;
    case 'ArrowDown':
      while (!isCollision()) {
        currentPosition.y++;
      }
      currentPosition.y--;
      mergeShape();
      clearLines();
      generateNewShape();
      break;
  }
});

function resetGame() {
  score = 0;
  timeLeft = 120;
  currentScoreDisplay.textContent = score;
  highScoreDisplay.textContent = highScore;
  board.forEach(row => row.fill(0));
  message.classList.add('hidden');
  loadingScreen.classList.remove('hidden');
  backgroundMusic.pause();
  backgroundMusic.currentTime = 0;
}

window.addEventListener('beforeunload', resetGame);
