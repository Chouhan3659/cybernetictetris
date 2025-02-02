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
  [[1, 1, 1, 1]], // I
  [[1, 1, 1], [0, 1, 0]], // T
  [[1, 1], [1, 1]], // O
  [[1, 1, 0], [0, 1, 1]], // S
  [[0, 1, 1], [1, 1, 0]], // Z
  [[1, 1, 1], [1, 0, 0]], // L
  [[1, 1, 1], [0, 0, 1]] // J
];

let currentPiece = {
  shape: shapes[Math.floor(Math.random() * shapes.length)],
  x: 3,
  y: 0,
  color: COLORS[Math.floor(Math.random() * COLORS.length)]
};

const flirtyPhrases = [
  "You're a natural! 😉",
  "Looking good! 😘",
  "Drop it like it's hot! 🔥",
  "You're crushing it! 💪",
  "Wow, you're amazing! 😍",
  "Keep it up, cutie! 😏",
  "You're unstoppable! 🚀"
];

function drawBlock(x, y, color) {
  context.fillStyle = color;
  context.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
  context.strokeStyle = '#000';
  context.strokeRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
}

function drawBoard() {
  context.clearRect(0, 0, canvas.width, canvas.height);
  board.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value) {
        drawBlock(x, y, value);
      }
    });
  });
  currentPiece.shape.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value) {
        drawBlock(currentPiece.x + x, currentPiece.y + y, currentPiece.color);
      }
    });
  });
}

function collide() {
  return currentPiece.shape.some((row, y) => {
    return row.some((value, x) => {
      return value && (board[currentPiece.y + y] && board[currentPiece.y + y][currentPiece.x + x]) !== 0;
    });
  });
}

function merge() {
  currentPiece.shape.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value) {
        board[currentPiece.y + y][currentPiece.x + x] = currentPiece.color;
      }
    });
  });
}

function clearLines() {
  let linesCleared = 0;
  board.forEach((row, y) => {
    if (row.every(cell => cell !== 0)) {
      board.splice(y, 1);
      board.unshift(Array(COLS).fill(0));
      linesCleared++;
    }
  });
  score += linesCleared * 100;
  currentScoreDisplay.textContent = score;
  if (score > highScore) {
    highScore = score;
    highScoreDisplay.textContent = highScore;
  }
  if (score >= 1000) {
    endGame(true);
  }
  showFlirtyMessage();
}

function showFlirtyMessage() {
  const randomMessage = flirtyPhrases[Math.floor(Math.random() * flirtyPhrases.length)];
  flirtyMessages.textContent = randomMessage;
}

function dropPiece() {
  currentPiece.y++;
  if (collide()) {
    currentPiece.y--;
    merge();
    clearLines();
    currentPiece = {
      shape: shapes[Math.floor(Math.random() * shapes.length)],
      x: 3,
      y: 0,
      color: COLORS[Math.floor(Math.random() * COLORS.length)]
    };
    if (collide()) {
      endGame(false);
    }
  }
}

function movePiece(direction) {
  currentPiece.x += direction;
  if (collide()) {
    currentPiece.x -= direction;
  }
  moveSound.play();
}

function rotatePiece() {
  const rotated = currentPiece.shape[0].map((_, i) => currentPiece.shape.map(row => row[i])).reverse();
  const previousShape = currentPiece.shape;
  currentPiece.shape = rotated;
  if (collide()) {
    currentPiece.shape = previousShape;
  }
  rotateSound.play();
}

function updateTimer() {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  timerDisplay.textContent = `Time: ${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  if (timeLeft <= 0) {
    endGame(false);
  } else {
    timeLeft--;
  }
}

function endGame(success) {
  clearInterval(timerInterval);
  clearInterval(gameInterval);
  if (success) {
    message.style.display = 'block';
    createBalloons();
  } else {
    alert('Game Over! Try again.');
  }
}

function createBalloons() {
  for (let i = 0; i < 50; i++) {
    const balloon = document.createElement('div');
    balloon.classList.add('balloon');
    balloon.style.left = `${Math.random() * 100}vw`;
    balloon.style.animationDuration = `${Math.random() * 5 + 3}s`;
    document.body.appendChild(balloon);
  }
}

// Touch Controls
moveLeftButton.addEventListener('click', () => movePiece(-1));
moveRightButton.addEventListener('click', () => movePiece(1));
rotateButton.addEventListener('click', () => rotatePiece());
dropButton.addEventListener('click', () => dropPiece());

// Keyboard Controls (Fallback for Desktop)
document.addEventListener('keydown', event => {
  if (event.key === 'ArrowLeft') {
    movePiece(-1);
  } else if (event.key === 'ArrowRight') {
    movePiece(1);
  } else if (event.key === 'ArrowDown') {
    dropPiece();
  } else if (event.key === 'ArrowUp') {
    rotatePiece();
  }
});

// Start Game
startButton.addEventListener('click', () => {
  startButton.style.display = 'none';
  gameContainer.style.display = 'flex';
  mobileControls.style.display = 'flex';
  backgroundMusic.play().catch(() => {
    alert("Tap anywhere to start the music!");
  });
  timerInterval = setInterval(updateTimer, 1000);
  gameInterval = setInterval(() => {
    dropPiece();
    drawBoard();
  }, 1000);
});

// Fix for autoplay policy
document.body.addEventListener('click', () => {
  backgroundMusic.play();
  loadingScreen.classList.add('hidden');
  container.classList.remove('hidden');
});
