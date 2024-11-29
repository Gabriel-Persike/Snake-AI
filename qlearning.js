var PerceptronQLearning = null;

class QLearningAgent {
	constructor(states, actions, alpha, gamma, epsilon) {
		this.states = states;
		this.actions = actions;
		this.alpha = alpha; // Learning rate
		this.gamma = gamma; // Discount factor
		this.epsilon = epsilon; //  Exploration rate

		this.qTable = {};

		for (const state of states) {
			this.qTable[state] = {};
			for (const action of actions) {
				this.qTable[state][action] = 0;
			}
		}
	}

	chooseAction(state) {
            var maxQ = this.qTable[state];
            if (maxQ && maxQ != {}) {
			    var maxQ = Math.max(...Object.values(this.qTable[state]));
                if (true) {
                    if (Math.random() < this.epsilon) {
                        return this.actions[Math.floor(Math.random() * this.actions.length)];
                    }
                }

                return Object.keys(this.qTable[state]).find((key) => this.qTable[state][key] === maxQ);
            }else{
                return this.actions[Math.floor(Math.random() * this.actions.length)];
            }
		
	}

	updateQValue(state, action, reward, nextState) {
		var maxQNext = this.qTable[nextState];
		if (maxQNext) {
			maxQNext = Math.max(...Object.values(maxQNext));
		} else {
			maxQNext = 0;
		}

        if (isNaN(maxQNext)) {
            maxQNext = 0;
        }

        var qValue = null;
        if (!this.qTable[state] || !this.qTable[state][action]) {
            qValue = 0;   
            if(!this.qTable[state])
            this.qTable[state] = {};

            // for (const action of this.actions) {
                this.qTable[state][action] = 0;
            // }
        }
        else{
            qValue = this.qTable[state][action];
        }
    
        var newValue = this.alpha * (reward + this.gamma * maxQNext - qValue);
        if (reward <= -1) {
            console.error(state, action, this.alpha, reward, this.gamma, maxQNext, qValue, newValue);
        }
        else if(reward>=1){
            console.log(state, action, this.alpha, reward, this.gamma, maxQNext, qValue, newValue);
        }
		this.qTable[state][action] += newValue;
	}

	train(env, episodes) {
		for (let episode = 0; episode < episodes; episode++) {
			var state = env.reset();
			var done = false;

			while (!done) {
				var action = this.chooseAction(state);
				var { nextState, reward, done } = env.step(action);
				this.updateQValue(state, action, reward, nextState);
				state = nextState;
			}
		}
	}
}

function StartQLearning() {
	var states = [player.x - food.x, player.y - food.y, map.x - player.x, map.y - player.y];

	PerceptronQLearning = new QLearningAgent(states, ["up", "down", "left", "right"], 0.3, 0.2, 0.3);
}