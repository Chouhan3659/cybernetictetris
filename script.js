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
let gameActive = false;

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

let currentPiece = generatePiece();

const flirtyPhrases = [
  "You're a natural! 😉",
  "Looking good! 😘",
  "Drop it like it's hot! 🔥",
  "You're crushing it! 💪",
  "Wow, you're amazing! 😍",
  "Keep it up, cutie! 😏",
  "You're unstoppable! 🚀"
];

function generatePiece() {
  return {
    shape: shapes[Math.floor(Math.random() * shapes.length)],
    x: 3,
    y: 0,
    color: COLORS[Math.floor(Math.random() * COLORS.length)]
  };
}

function drawBlock(x, y, color) {
  context.fillStyle = color;
  context.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
  context.strokeStyle = '#000';
  context.strokeRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
}

function drawBoard() {
  context.clearRect(0, 0, canvas.width, canvas.height);
  board.forEach((row, y) => row.forEach((value, x) => value && drawBlock(x, y, value)));
  currentPiece.shape.forEach((row, y) => row.forEach((value, x) => value && drawBlock(currentPiece.x + x, currentPiece.y + y, currentPiece.color)));
}

function collide() {
  return currentPiece.shape.some((row, y) =>
    row.some((value, x) => value && (board[currentPiece.y + y]?.[currentPiece.x + x] !== 0))
  );
}

function merge() {
  currentPiece.shape.forEach((row, y) =>
    row.forEach((value, x) => value && (board[currentPiece.y + y][currentPiece.x + x] = currentPiece.color))
  );
}

function clearLines() {
  let linesCleared = board.reduce((acc, row, y) => {
    if (row.every(cell => cell !== 0)) {
      board.splice(y, 1);
      board.unshift(Array(COLS).fill(0));
      return acc + 1;
    }
    return acc;
  }, 0);
  score += linesCleared * 100;
  updateScore();
}

function updateScore() {
  currentScoreDisplay.textContent = score;
  if (score > highScore) highScoreDisplay.textContent = highScore = score;
  if (score >= 1000) endGame(true);
  showFlirtyMessage();
}

function showFlirtyMessage() {
  flirtyMessages.textContent = flirtyPhrases[Math.floor(Math.random() * flirtyPhrases.length)];
}

function dropPiece() {
  currentPiece.y++;
  if (collide()) {
    currentPiece.y--;
    merge();
    clearLines();
    currentPiece = generatePiece();
    if (collide()) endGame(false);
  }
}

function movePiece(direction) {
  currentPiece.x += direction;
  if (collide()) currentPiece.x -= direction;
  moveSound.play();
}

function rotatePiece() {
  const prevShape = currentPiece.shape;
  currentPiece.shape = currentPiece.shape[0].map((_, i) => currentPiece.shape.map(row => row[i])).reverse();
  if (collide()) currentPiece.shape = prevShape;
  rotateSound.play();
}

function updateTimer() {
  if (--timeLeft <= 0) endGame(false);
  timerDisplay.textContent = `Time: ${Math.floor(timeLeft / 60)}:${(timeLeft % 60).toString().padStart(2, '0')}`;
}

function endGame(success) {
  clearInterval(timerInterval);
  clearInterval(gameInterval);
  gameActive = false;
  message.style.display = success ? 'block' : 'none';
  if (!success) alert('Game Over! Try again.');
}

// Start Game
startButton.addEventListener('click', () => {
  if (gameActive) return;
  gameActive = true;
  startButton.style.display = 'none';
  gameContainer.style.display = 'flex';
  mobileControls.style.display = 'flex';
  backgroundMusic.play().catch(() => alert("Tap anywhere to start the music!"));
  timerInterval = setInterval(updateTimer, 1000);
  gameInterval = setInterval(() => (dropPiece(), drawBoard()), 1000);
});

document.body.addEventListener('click', () => {
  backgroundMusic.play();
  loadingScreen.classList.add('hidden');
  container.classList.remove('hidden');
});
