const playerBat = document.getElementById('playerBat');
const opponentBat = document.getElementById('opponentBat');
const ball = document.getElementById('ball');
const scoreDisplay = document.getElementById('score');
const gameContainer = document.getElementById('game-container');
const rect = gameContainer.getBoundingClientRect();

let ballX = rect.width/2;
let ballY = rect.height/2;
let ballSpeedX = 5;
let ballspeedY = 5;

let playerScore = 0;
let opponentScore = 0;

function updateGame() {
    // move ball
    ballX += ballSpeedX;
    ballY += ballspeedY;

    let leftBoundary = 0;
    let rightBoundary = rect.width;
    let topBoundary = 0;
    let bottomBoundary = rect.height;

    // ball collision with walls
    if (ballY <= topBoundary || ballY >= bottomBoundary) {
        ballspeedY *= -1;
    }

    // ball collision with bats
    if (
        (ballX <= leftBoundary + 20 && ballX >= leftBoundary && ballY >= parseInt(playerBat.style.top) && ballY <= parseInt(playerBat.style.top) + 100) || 
        (ballX >= rightBoundary - 20 && ballX <= rightBoundary && ballY >= parseInt(opponentBat.style.top) && ballY <= parseInt(opponentBat.style.top) + 100)
    ) {
        ballSpeedX *= -1;
    }

    // Scoring
    if (ballX <= leftBoundary || ballX >= rightBoundary) {
        if (ballX <= leftBoundary) {
            opponentScore++;
        } else {
            playerScore++;
        }
        resetBall();
    }

    // move opponent bat
    opponentBat.style.top = `${Math.min(rect.height - 102, Math.max(0, ballY - 50))}px`;

    // update ball position
    ball.style.left = `${ballX}px`;
    ball.style.top = `${ballY}px`

    // update score
    scoreDisplay.textContent = `${playerScore} - ${opponentScore}`;

    if (opponentScore < 10 && playerScore < 10) {
        requestAnimationFrame(updateGame);
    }
}
 
function resetBall() {
    ballX = rect.width/2;
    ballY = rect.height/2;
    ballSpeedX = -ballSpeedX;
    ballspeedY = -ballspeedY;
}

// Handle player bat moment
document.addEventListener('mousemove', (e) => {
    let bottom = rect.height - 102
    playerBat.style.top = `${Math.min(bottom, Math.max(0, e.clientY - 50))}px`;
});

// start the game loop
updateGame();