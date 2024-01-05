const playerBat = document.getElementById('playerBat');
const opponentBat = document.getElementById('opponentBat');
const gameContainer = document.getElementById('game-container');
const rect = gameContainer.getBoundingClientRect();
const ball = document.getElementById('ball');

let ballX = rect.width/2;
let ballY = rect.height/2;
let playerScore = 0;
let opponentScore = 0;
let prev_state = [0, 0, 0, 0, 0, 0, 0]
let prev_action = [0]
let maxScore = 100

let gameState = getGameState();

function getGameState() {
    x = parseFloat(ballX / rect.width)
    y = parseFloat(ballY / rect.height)
    width = parseFloat(rect.width)
    height = parseFloat(rect.height)
    playerPos = parseFloat(playerBat.style.top)
    if (!playerPos) {
        playerPos = 0
    } else {
        playerPos = playerPos/width
    }
    agentPos = parseFloat(opponentBat.style.top)
    if (!agentPos) {
        agentPos = 0
    } else {
        agentPos = agentPos/width
    }

    console.log([x, y, parseFloat((playerScore - opponentScore)/maxScore),1, 1, playerPos, agentPos])
    return [x, y, parseFloat((playerScore - opponentScore)/maxScore),1, 1, playerPos, agentPos]
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
        opponentAction = data.action;
        prev_state = data.prev_state
        prev_action = data.prev_action

        console.log("inside get action: will be prev_state: ", prev_state, " and will be prev_action: ", prev_action)
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
            body: JSON.stringify({ reward, penalty , gameState, prev_state, prev_action}),
        });

        console.log("Send reward and penalty", response);
    } catch (error) {
        console.error('Error:', error);
    }
}