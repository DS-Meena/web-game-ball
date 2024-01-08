from model import DDPGAgent
import numpy as np

state_dim = 7
max_action = 100.0
num_episodes = 1

agent = DDPGAgent(state_dim, max_action)

# training loop
for episode in range(num_episodes):
    # get initial state
    state = [0, 0, 0, 0, 0, 0] 
    done = False

    for _ in range(10):
        action = agent.actor(state)  # .numpy()
        print("Episode: ", episode, " Action: ", action)
        print(action.numpy()[0][0])

        # Apply the action to the environment, get next state, reward and done
        next_state = [5, 5, 2, 3, 4, 5, 2]
        reward = 1
        done = False
        # next_state, reward, done = take_action_and_get_next_state(action)

        # Train the agent
        agent.train_step(state, action, reward, next_state, done)

        state = next_state
