from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import numpy as np
import tensorflow as tf
from model.py import DDPGAgent 

state_dim = 7
max_action = 1.0
num_episodes = 500
prev_state = {
        'ballX': 0,
        'ballY': 0,
        'scoreDifference': 0,
        'groundWidth': 0,
        'groundHeight': 0,
        'playerBat': 0,
        'opponentBat': 0
    }
prev_action = 0

agent = DDPGAgent(state_dim, max_action)

app = Flask(__name__)
CORS(app)

# Assuming I have a trained model
# model = tf.keras.models.load_model('my_model.h5')

@app.route('/get_opponent_action', methods=['POST'])
def get_opponent_action():

    data = request.get_json()
    game_state = np.array(data['gameState'])

    action = agent.actor(game_state).numpy()
    
    print("Action predicted by action is ", action)
    # preprocessed_state = preprocess_state(game_state)

    # action = model.predict(np.expand_dims(preprocessed_state, axis=0))[0]

    # formatted_action = postprocess_action(action)

    # action = 3 # np.random.randint(1, 3)

    prev_state = game_state
    prev_action = action
    return jsonify({'action': action})

@app.route('/update_reward_penalty', methods=['POST'])
def update_reward_penalty():
    data = request.get_json()

    # Extract reward and penalty from the request
    reward = data['reward']
    penalty = data['penalty']
    gameState = data['gameState']

    print("Prev state and actions are " ,prev_state, prev_action)
    agent.train_step(prev_state, prev_action, reward, gameState, False)

    return jsonify({'status': 'success'})

@app.route('/')
def index():
    return render_template('index.html')

if __name__ == '__main__':
    app.run(port=5500, debug=True)