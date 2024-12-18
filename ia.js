let perc = null;
class Perceptron {
	constructor(inputSize, outputSize) {
		// Initialize weights randomly
		this.weights = Array(inputSize)
			.fill(0)
			.map(() =>
				Array(outputSize)
					.fill(0)
					.map(() => Math.random())
			);
		this.bias = Array(outputSize)
			.fill(0)
			.map(() => Math.random());
	}

	// Activation function (step function)
	activation(x) {
		return x >= 0 ? 1 : 0;
	}

	// Predict the output given an input vector
	predict(inputs) {
		// Corrected weighted sum of inputs
		let output = this.weights[0].map((_, i) => {
			return this.weights.reduce((sum, weight, j) => sum + inputs[j] * weight[i], 0) + this.bias[i];
		});

		// Apply the activation function to each output
		return output.map(this.activation);
	}

	// Training function using gradient descent
	train(inputs, outputs, learningRate = 0.0001, epochs = 2) {
		for (let epoch = 0; epoch < epochs; epoch++) {
			for (let i = 0; i < inputs.length; i++) {
				let inputVector = inputs[i];
				let outputVector = outputs[i];

				// Forward pass: predict output
				let prediction = this.predict(inputVector);

				// Calculate error
				let error = outputVector.map((value, idx) => value - prediction[idx]);

				// Update weights and biases
				for (let j = 0; j < this.weights.length; j++) {
					for (let k = 0; k < this.weights[j].length; k++) {
						this.weights[j][k] += learningRate * (error[k] * inputVector[j]);
					}
					this.bias[j] += (learningRate / 10) * error[j];
				}
			}
		}
	}
}
function shuffle(array) {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
	}
	return array;
}
function getOutputs(inputs) {
	var outputs = [];
	for (const input of inputs) {
		if (input[0] > 0) {
			outputs.push([0, 0, 0, 1]);
		} else if (input[0] < 0) {
			outputs.push([0, 0, 1, 0]);
		} else if (input[1] > 0) {
			outputs.push([0, 1, 0, 0]);
		} else if (input[1] < 0) {
			outputs.push([1, 0, 0, 0]);
		}
	}

	return outputs;
}
function StartPerceptron(){
    let perc = new Perceptron(2, 4); // 8 inputs (features), 4 outputs (directions)
    var data = {
        inputs: shuffle([
            [1, 0],
            [1, 1],
            [1, -1],
            [-1, 0],
            [-1, 1],
            [-1, -1],
            [0, 1],
            [0, -1],
        ]),
    };
    data.outputs = getOutputs(data.inputs);

    perc.train(data.inputs, data.outputs, 0.00001, 1000000);
    console.log("end train");
    
}