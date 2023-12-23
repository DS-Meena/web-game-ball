const scoreDisplay = document.getElementById('score');

let ballSpeedX = 5;
let ballspeedY = 5;
let action = 2;
let opponentPosition = 50;

function updateGame() {
    // move ball
    ballX += ballSpeedX;
    ballY += ballspeedY;

    let leftBoundary = 0;
    let rightBoundary = rect.width;
    let topBoundary = 0;
    let bottomBoundary = rect.height;

    // get opponent's action
    var action = getAction();
    console.log("This action is got from opponent ", action)
    
    console.log(opponentBat)
    let opponentPosition = parseInt(opponentBat.style.top) || 50;

    // Check if opponentPosition is a valid number
    if (!isNaN(opponentPosition)) {
        if (action == 1) {
            opponentPosition = opponentPosition - 1;
        } else {
            opponentPosition = opponentPosition + 1;
        }

        // Move opponent bat
        opponentBat.style.top = `${Math.min(rect.height - 102, Math.max(0, opponentPosition))}px`;
    } else {
        console.error("Error: Invalid opponentPosition");
    }

    // opponentBat.style.top = `${Math.min(rect.height - 102, Math.max(0, ballY - 50))}px`;

    // ball collision with walls
    if (ballY <= topBoundary || ballY >= bottomBoundary) {
        ballspeedY *= -1;
    }

    let reward = 0, penalty = 0;

    // ball collision with bats
    if (
        (ballX <= leftBoundary + 20 && ballX >= leftBoundary && ballY >= parseInt(playerBat.style.top) && ballY <= parseInt(playerBat.style.top) + 100) || 
        (ballX >= rightBoundary - 20 && ballX <= rightBoundary && ballY >= parseInt(opponentBat.style.top) && ballY <= parseInt(opponentBat.style.top) + 100)
    ) {
        ballSpeedX *= -1;

        if (ballX >= rightBoundary - 20 && ballX <= rightBoundary && ballY >= parseInt(opponentBat.style.top) && ballY <= parseInt(opponentBat.style.top) + 100) {
            reward += 2;
        }
    }

    // Scoring
    if (ballX <= leftBoundary || ballX >= rightBoundary) {
        if (ballX <= leftBoundary) {
            opponentScore++;
            reward += 5;
        } else {
            playerScore++;
            penalty += 5;
        }
        resetBall();
    }

    // update ball position
    ball.style.left = `${ballX}px`;
    ball.style.top = `${ballY}px`
    
    // update score
    scoreDisplay.textContent = `${playerScore} - ${opponentScore}`;

    if (opponentScore < 1 && playerScore < 1) {
        requestAnimationFrame(updateGame);
    }

    sendRewardPenalty(reward, penalty);
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