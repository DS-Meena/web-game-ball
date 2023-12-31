const scoreDisplay = document.getElementById('score');

let action = 2;
let opponentPosition = 50;
let reward = 0;
let penalty = 0;

async function updateGame() {
    // move ball
    ballX += ballSpeedX;
    ballY += ballspeedY;

    let leftBoundary = 0;
    let rightBoundary = rect.width;
    let topBoundary = 0;
    let bottomBoundary = rect.height;

    console.log("opponent position is ", opponentBat.style.top)
    // opponentBat.style.top = `${Math.min(rect.height - 102, Math.max(0, ballY - 50))}px`;
    // playerBat.style.top = `${Math.min(rect.height, Math.max(0, ballY - 50))}px`;

    // ball collision with walls
    if (ballY <= topBoundary || ballY >= bottomBoundary) {
        ballspeedY *= -1;
    }

    // ball collision with bats
    if (
        (ballX <= leftBoundary + 20 && ballX >= leftBoundary && ballY >= parseInt(playerBat.style.top) && ballY <= parseInt(playerBat.style.top) + 100) || 
        (ballX >= rightBoundary - 20 && ballX <= rightBoundary && ballY > parseInt(opponentBat.style.top)+3 && ballY < parseInt(opponentBat.style.top) + 97)
    ) {
        ballSpeedX *= -1;

        if (ballX <= leftBoundary + 20) {
            // came to next state
            console.log("Award and penalty are ", reward, penalty)
            await sendRewardPenalty(reward, penalty);
            reward = 0
            penalty = 0

            // now update agent bat
            await updateOpponentPosition();
            
        } else {
            reward += 5
        }
    }

    // Scoring
    if (ballX <= leftBoundary || ballX >= rightBoundary) {
        if (ballX <= leftBoundary) {
            opponentScore++;
            reward += 10;
        } else {
            playerScore++;

            // distance between ball and bat
            dist = ballY - parseInt(opponentBat.style.top);
            if (dist < 0) {
                dist *= -1
            }

            penalty += dist;
        }
        
        ballSpeedX *= -1;
        // resetBall();
    }

    // update ball position
    ball.style.left = `${ballX}px`;
    ball.style.top = `${ballY}px`
    
    // update score
    scoreDisplay.textContent = `${playerScore} - ${opponentScore}`;

    if (opponentScore < maxScore && playerScore < maxScore) {
        requestAnimationFrame(updateGame);
    }
}

function resetBall() {
    ballX = rect.width/2;
    ballY = rect.height/2;
    ballSpeedX = ballSpeedX;
    if (ballSpeedX > 0) {
        ballSpeedX *= -1
    } 
    ballspeedY = ballspeedY;
}

// Handle player bat moment
document.addEventListener('mousemove', (e) => {
    let bottom = rect.height - 102
    playerBat.style.top = `${Math.min(bottom, Math.max(0, e.clientY - 50))}px`;
});

// start the game loop
updateGame();
