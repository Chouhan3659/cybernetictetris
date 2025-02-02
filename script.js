const canvas = document.getElementById('tetris');
const context = canvas.getContext('2d');
const startButton = document.getElementById('startButton');
const gameContainer = document.getElementById('gameContainer');
const timerDisplay = document.getElementById('timerDisplay');
const mobileControls = document.getElementById('mobileControls');
const loadingScreen = document.getElementById('loadingScreen');
const backgroundMusic = document.getElementById('backgroundMusic');

let timeLeft = 120; // 2 minutes
let timerInterval;
let gameInterval;

function startGame() {
    startButton.style.display = 'none';
    gameContainer.classList.remove('hidden');
    mobileControls.style.display = 'flex';

    backgroundMusic.play().catch(() => {
        alert("Tap anywhere to start the music!");
    });

    timerInterval = setInterval(updateTimer, 1000);
    gameInterval = setInterval(gameLoop, 1000);
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
        document.getElementById('message').classList.remove('hidden');
    } else {
        alert("Game Over! Try again.");
        location.reload();
    }
}

document.body.addEventListener('click', () => {
    backgroundMusic.play();
    loadingScreen.classList.add('hidden');
    document.querySelector('.container').classList.remove('hidden');
});

startButton.addEventListener('click', startGame);
