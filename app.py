from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import numpy as np
import tensorflow as tf
from model import DDPGAgent 

state_dim = 7
max_action = 100.0
num_episodes = 500

agent = DDPGAgent(state_dim, max_action)

app = Flask(__name__)
CORS(app)

# Assuming I have a trained model
# model = tf.keras.models.load_model('my_model.h5')

@app.route('/get_opponent_action', methods=['POST'])
def get_opponent_action():

    data = request.get_json()
    game_state = data['gameState']

    print("Item is ------- ", agent.actor(game_state).numpy().item())
    action = agent.actor(game_state).numpy()[0][0]
    action = float(action)
    
    print("Action predicted by action is ", action)

    prev_state = game_state
    prev_action = [action]

    print(prev_state, prev_action)
    return jsonify({'action': action, 'prev_state': prev_state, "prev_action": prev_action})

@app.route('/update_reward_penalty', methods=['POST'])
def update_reward_penalty():
    data = request.get_json()

    # Extract reward and penalty from the request
    reward = data['reward']
    penalty = data['penalty']
    gameState = data['gameState']
    prev_state = data['prev_state']
    prev_action = data['prev_action']

    agent.train_step(prev_state, prev_action, reward-penalty, gameState, False)

    return jsonify({'status': 'success'})

@app.route('/')
def index():
    return render_template('index.html')

if __name__ == '__main__':
    app.run(port=5500, debug=True)