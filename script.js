const startButton = document.getElementById('startButton');
const gameContainer = document.getElementById('gameContainer');
const scoreboard = document.getElementById('scoreboard');
const scoreDisplay = document.getElementById('score');
const timerDisplay = document.getElementById('timerDisplay');
const message = document.getElementById('message');
const balloonContainer = document.getElementById('balloonContainer');
const loadingScreen = document.getElementById('loadingScreen');
const clickSound = document.getElementById('clickSound');

let score = 0;
let timeLeft = 30; // 30 seconds timer
let timerInterval;
let gameInterval;

startButton.addEventListener('click', startGame);

function startGame() {
    loadingScreen.style.display = 'none';
    gameContainer.classList.remove('hidden');
    startButton.style.display = 'none';

    // Start timer countdown
    timerInterval = setInterval(updateTimer, 1000);

    // Start spawning balloons
    gameInterval = setInterval(spawnBalloon, 1500); // New balloon every 1.5 seconds
}

function updateTimer() {
    if (timeLeft <= 0) {
        clearInterval(timerInterval);
        clearInterval(gameInterval);
        message.style.display = 'block';
        message.innerText = `Game Over! Final Score: ${score}`;
    } else {
        timeLeft--;
        timerDisplay.innerText = `Time: ${timeLeft}`;
    }
}

function spawnBalloon() {
    const balloon = document.createElement('div');
    balloon.id = 'balloon';
    balloon.style.top = `${Math.random() * window.innerHeight}px`;
    balloon.style.left = `${Math.random() * window.innerWidth}px`;
    balloonContainer.appendChild(balloon);

    // Make the balloon clickable
    balloon.addEventListener('click', () => {
        score++;
        scoreDisplay.innerText = score;
        clickSound.play();
        balloon.remove(); // Remove balloon when clicked
    });

    // Make the balloon float off screen after 2.5 seconds if not clicked
    setTimeout(() => {
        if (balloon) {
            balloon.remove();
        }
    }, 2500);
}
