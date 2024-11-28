class Perceptron {
    constructor(inputSize, outputSize) {
        // Initialize weights randomly
        this.weights = Array(inputSize).fill(0).map(() => Array(outputSize).fill(0).map(() => Math.random()));
        this.bias = Array(outputSize).fill(0).map(() => Math.random());
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
    train(inputs, outputs, learningRate = 0.001, epochs = 2) {
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
                        this.weights[j][k] += learningRate * error[k] * inputVector[j];
                    }
                    this.bias[j] += learningRate * error[j];
                }
            }
        }
    }
}




let perc = new Perceptron(2, 4);  // 8 inputs (features), 4 outputs (directions)

var  data = {
    "inputs": [
      [12, -89],
      [-62, 41],
      [87, -53],
      [34, -5],
      [0, 23],//5
      [0, -32],
      [-71, 48],
      [64, -88],
      [-39, 22],
      [55, -75],
      [-27, 99],
      [41, -50],
      [0, -92],
      [56, 88],
      [-88, -16],
      [0, 37],
      [11, 67],
      [-50, 44],
      [0, -69],
      [0, 77],
      [-59, 40],
      [0, 72],
      [-64, 51],
      [0, -57],
      [-82, 90],
      [11, 44],
      [0, -30],
      [18, -64],
      [-100, 13]
    ],
  }

data.outputs = getOutputs(data.inputs);
  


perc.train(data.inputs, data.outputs, 0.01, 100000);
console.log("end train")



let inputVector = [(player.x-food.x), player.y-food.y];  // Get the input vector

let action = perc.predict(inputVector);  // Get the next move from the perceptron



// trainer.train();



function getOutputs(inputs){
    var outputs = [];
    for (const input of inputs) {
        if (input[0] > 0) {
            outputs.push([0,0,0,1]);
        }
        else if(input[0] < 0){
            outputs.push([0,0,1,0]);
        }
        else if(input[1] > 0){
            outputs.push([0,1,0,0]);
        }
        else if(input[1] < 0){
            outputs.push([1,0,0,0]);
        }
    }


    return outputs;
}