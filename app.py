from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import numpy as np
import tensorflow as tf 

app = Flask(__name__)
CORS(app)

# Assuming I have a trained model
# model = tf.keras.models.load_model('my_model.h5')

@app.route('/get_opponent_action', methods=['POST'])
def get_opponent_action():

    data = request.get_json()
    game_state = np.array(data['gameState'])

    # preprocessed_state = preprocess_state(game_state)

    # action = model.predict(np.expand_dims(preprocessed_state, axis=0))[0]

    # formatted_action = postprocess_action(action)

    action = 3 # np.random.randint(1, 3)

    return jsonify({'action': action})

def preprocess_state(game_state):

    return game_state

def postprocess_action(action):

    return int(np.argmax(action))

@app.route('/update_reward_penalty', methods=['POST'])
def update_reward_penalty():
    data = request.get_json()

    # Extract reward and penalty from the request
    reward = data['reward']
    penalty = data['penalty']

    update_agent(reward, penalty)

    return jsonify({'status': 'success'})

def update_agent(reward, penalty):
    # Implement logic to update the agent based on reward and penalty
    # For example, you can use the reward and penalty to update the Q-values in your DQN model

    k = 2

@app.route('/')
def index():
    print("xxxxxxxxxxxxxxxxxxxxx you in index")
    return render_template('index.html')

if __name__ == '__main__':
    app.run(port=5500, debug=True)