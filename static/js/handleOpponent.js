const playerBat = document.getElementById('playerBat');
const opponentBat = document.getElementById('opponentBat');
const gameContainer = document.getElementById('game-container');
const rect = gameContainer.getBoundingClientRect();
const ball = document.getElementById('ball');

let ballX = rect.width/2;
let ballY = rect.height/2;
let playerScore = 0;
let opponentScore = 0;

let gameState = getGameState();

function getGameState() {
    return {
        'ballX': ballX,
        'ballY': ballY,
        'scoreDifference': playerScore - opponentScore,
        'groundWidth': rect.width,
        'groundHeight': rect.height,
        'playerBat': playerBat.style.top,
        'opponentBat': opponentBat.style.top
    }
}

async function getAction() {
    
    gameState = getGameState();
    let opponentAction = 10

    try {
        const response = await fetch('http://localhost:5500/get_opponent_action', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ gameState })
        });

        const data = await response.json();
        console.log("We got action", data);
        opponentAction = data.action;
    } catch (error) {
        console.error('Error:', error);
    }

    return opponentAction;
}

async function updateOpponentPosition() {
    // get opponent's action
    var action = await getAction();
    
    let opponentPosition = parseInt(opponentBat.style.top) || 50;

    // Check if opponentPosition is a valid number
    if (!isNaN(opponentPosition)) {

        opponentPosition = opponentPosition + action

        // Move opponent bat
        opponentBat.style.top = `${Math.min(rect.height - 102, Math.max(0, opponentPosition))}px`;
    } else {
        console.error("Error: Invalid opponentPosition");
    }
}

// function to send reward or penalty
async function sendRewardPenalty(reward, penalty) {
    gameState = getGameState();

    try {
        const response = await fetch('http://localhost:5500/update_reward_penalty', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ reward, penalty , gameState}),
        });

        console.log("Send reward and penalty", response);
    } catch (error) {
        console.error('Error:', error);
    }
}