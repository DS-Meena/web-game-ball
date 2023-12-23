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

function getAction() {
    
    gameState = getGameState();
    let opponentAction = 1

    fetch('http://localhost:5500/get_opponent_action', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ gameState })
    })
    .then(response => response.json())
    .then(data => {
        opponentAction = data.action;
    })
    .catch(error => console.error('Error:', error));

    return opponentAction;
}

// function to send reward or penalty
function sendRewardPenalty(reward, penalty) {
    fetch('http://localhost:5500/update_reward_penalty', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({reward, penalty}),
    });
}