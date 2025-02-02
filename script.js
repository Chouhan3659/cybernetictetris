let startButton = document.getElementById('startButton');
let gameContainer = document.getElementById('gameContainer');
let message = document.getElementById('message');
let scoreElement = document.getElementById('score');
let funMessages = document.getElementById('funMessages');
let bgMusic = document.getElementById('bgMusic');
let score = 0;
let timer;
let gameStarted = false;
let intervalId;

// Play background music when page loads
bgMusic.play();

// Handle game start
startButton.addEventListener('click', function() {
    startButton.style.display = 'none';
    gameContainer.style.display = 'block';
    funMessages.style.visibility = 'visible';
    gameStarted = true;
    startGame();
});

function startGame() {
    let timeLeft = 120;
    timer = setInterval(function() {
        if (timeLeft <= 0) {
            clearInterval(timer);
            endGame();
        }
        timeLeft--;
    }, 1000);

    // Mock Tetris Game Loop (this should be replaced with real game logic)
    intervalId = setInterval(function() {
        if (gameStarted) {
            score++;
            updateScore();
            if (score >= 10) {
                showFlirtyMessage();
            }
            if (score >= 20) {
                clearInterval(intervalId);
                endGame();
            }
        }
    }, 1000);  // Game loop (1 second per score increment for testing)
}

function endGame() {
    gameStarted = false;
    message.style.visibility = 'visible';
}

function updateScore() {
    scoreElement.textContent = `Score: ${score}`;
}

function showFlirtyMessage() {
    // Show flirty message after score reaches 10
    funMessages.style.visibility = 'visible';
}

// Mobile Controls
let leftButton = document.getElementById('leftButton');
let downButton = document.getElementById('downButton');
let rightButton = document.getElementById('rightButton');

leftButton.addEventListener('click', () => {
    // Implement move left (Tetris logic)
});

downButton.addEventListener('click', () => {
    // Implement move down (Tetris logic)
});

rightButton.addEventListener('click', () => {
    // Implement move right (Tetris logic)
});
