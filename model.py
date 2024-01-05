import numpy as np
import tensorflow as tf
from tensorflow.keras import layers, models, optimizers

# Define the Actor and Critic networks
class Actor(tf.keras.Model):
    def __init__(self, state_dim, max_action):
        super(Actor, self).__init__()
        self.fc1 = layers.Dense(64, activation='relu', kernel_initializer='he_normal')
        self.fc2 = layers.Dense(64, activation='relu', kernel_initializer='he_normal')
        self.fc3 = layers.Dense(64, activation='relu', kernel_initializer='he_normal')
        self.out = layers.Dense(1, activation='tanh')  # output range: [-1, 1]

        self.max_action = max_action
    
    def call(self, state):
        
        state_array = np.array([state], dtype=np.float32)
        x = self.fc1(state_array)
        x = self.fc2(x)
        x = self.fc3(x)
        action = self.out(x)

        return self.max_action * action
    
class Critic(tf.keras.Model):
    def __init__(self, state_dim):
        super(Critic, self).__init__()
        self.fc1 = layers.Dense(64, activation='relu')
        self.fc2 = layers.Dense(64, activation='relu')
        self.out = layers.Dense(1, activation='sigmoid')  # how good is the action

    def call(self, state, action):

        state = np.array([state], dtype=np.float32)
        action = tf.reshape(action, (-1, 1))

        x = tf.concat([state, action], axis=-1)
        x = self.fc1(x)
        x = self.fc2(x)
        value = self.out(x)
        return value
    
# Define the DDPG Agent
class DDPGAgent:
    def __init__(self, state_dim, max_action):
        self.actor = Actor(state_dim, max_action)
        self.critic = Critic(state_dim)

        # Target network for stability
        self.target_actor = Actor(state_dim, max_action)
        self.target_critic = Critic(state_dim)

        # Initialize target networks
        self.target_actor.set_weights(self.actor.get_weights())
        self.target_critic.set_weights(self.critic.get_weights())

        # Other hyperparameters
        self.gamma = 0.99
        self.tau = 0.001
        self.optimizer_actor = tf.keras.optimizers.Adam(lr=0.001)
        self.optimizer_critic = tf.keras.optimizers.Adam(lr=0.002)

    def train_step(self, state, action, reward, next_state, done):
        # Convert to Tensorflow tensors
        state = tf.convert_to_tensor(state, dtype=tf.float32)
        action = tf.convert_to_tensor(action, dtype=tf.float32)
        reward = tf.convert_to_tensor(reward, dtype=tf.float32)
        next_state = tf.convert_to_tensor(next_state, dtype=tf.float32)

        # Compute target Q-value
        target_action = self.target_actor(next_state)
        target_q = reward + self.gamma * self.target_critic(next_state, target_action) * (1 - done)

        # Compute critic loss
        with tf.GradientTape() as tape:
            current_q = self.critic(state, action)
            critic_loss = tf.losses.mean_squared_error(target_q, current_q)

        # Update critic
        critic_grads = tape.gradient(critic_loss, self.critic.trainable_variables)
        self.optimizer_critic.apply_gradients(zip(critic_grads, self.critic.trainable_variables))

        # Compute actor loss
        with tf.GradientTape() as tape:
            new_action = self.actor(state)
            actor_loss = -tf.reduce_mean(self.critic(state, new_action))

        # Update actor
        actor_grads = tape.gradient(actor_loss, self.actor.trainable_variables)
        self.optimizer_actor.apply_gradients(zip(actor_grads, self.actor.trainable_variables))

        # Soft update target networks
        self.update_target_networks()

    def update_target_networks(self):
        weights_actor = []
        for (var_actor, var_target_actor) in zip(self.actor.trainable_variables, self.target_actor.trainable_variables):
            weights_actor.append(self.tau * var_actor + (1 - self.tau) * var_target_actor)
        self.target_actor.set_weights(weights_actor)

        weights_critic = []
        for (var_critic, var_target_critic) in zip(self.critic.trainable_variables, self.target_critic.trainable_variables):
            weights_critic.append(self.tau * var_critic + (1 - self.tau) * var_target_critic)
        self.target_critic.set_weights(weights_critic)
