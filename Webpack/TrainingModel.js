console.log("\nTraining Model...")

// Ensure checkmate always stays more valuable than position
const CHECKMATE_GAMMA = 0.9;
const MAXBOARDS = 138410;
const LETTERS = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']

// How much will we dedicate to training
const trainingFraction = 0.8;
const trainNumber = MAXBOARDS * 0.8

// Brain data structure
const brain = require('brain.js');
const { Chess } = require("chess.js");

// Actual csv file
var csvFile = null;

// Read CSV data
var fileInput = document.getElementById("csv"),

    readFile = function () {

        var reader = new FileReader();
        reader.onload = function () {
            csvFile = reader.result;
        };
        // start reading the file. When it is done, calls the onload event defined above.
        reader.readAsBinaryString(fileInput.files[0]);
    };

// Call read csv on change of data
fileInput.addEventListener('change', readFile);

// Normalise to between 0 and 1
// Maintains negative/positive sign
function normalize(value, max, min) {

    // Return value between 0 and 0.5
    if (value < 0) {
        return ((-0.5 * value * CHECKMATE_GAMMA) / min) + 0.5
    }

    // Return value between 0.5 and 1
    return (0.5 * CHECKMATE_GAMMA * value / max) + 0.5
}

// Training function
function trainNN() {

    // If valid csv
    if (csvFile != null) {

        var trainingData = [];
        var evaluationData = [];
        
        // Function for creating csv as array
        // Credit: 
        // https://www.w3resource.com/javascript-exercises/fundamental/javascript-fundamental-exercise-3.php
        const csv_to_array = (data, delimiter = ',', omitFirstRow = true) =>
        data
          .slice(omitFirstRow ? data.indexOf('\n') + 1 : 0)
          .split('\n')
                .map(v => v.split(delimiter));
        
        // New array
        var csvArray = csv_to_array(csvFile);

        // Index Notes:
        // 0: FEN
        // Evaluation
        // Data source: Kaggle
        // https://www.kaggle.com/datasets/ronakbadhe/chess-evaluations
        
        // NOTES
        // net.train(ARRAY)
        // log: (error) => console.log(error),
        // logPeroid: 100
        // learningRate
        // errorThresh

        // Eval var
        let eval = null;

        let minValue = 1000000;
        let maxValue = -1000000;

        // Board
        let board = null;

        // Getting min and max
        for (let i = 0; i < Math.min(MAXBOARDS, csvArray.length); i++){

            let testValue = parseInt(csvArray[i][1].match(/-?\d+/g))
            if (testValue > maxValue) { maxValue = testValue }
            else if (testValue < minValue) { minValue = testValue}
        }

        // Iterate
        for (let i = 0; i < Math.min(MAXBOARDS, csvArray.length); i++){

            // Only use games with eval we can understand
            eval = normalize(parseInt(csvArray[i][1].match(/-?\d+/g)), maxValue, minValue)
            console.log("EVAL: " + eval)
            if (!Number.isNaN(eval)) {

                board = new Chess(csvArray[i][0])

                positions = {}

                // Board positions
                for (let j = 0; j < LETTERS.length; j++){
                    for (let k = 0; k < LETTERS.length; k++){
                        let tile = board.get(LETTERS[j] + (k + 1))
                        if (tile != null) {
                            if (tile.color == 'w' || tile.color == 'b') {
                                let keyString = LETTERS[j] + (k + 1) + "" + tile.type + tile.color
                                positions[keyString] = 1
                            }
                        }

                    }
                }

                if (i < trainNumber) {
                    trainingData.push({
                        input: positions,
                        output: [eval]
                    })
                }
                else {
                    evaluationData.push({
                        input: positions,
                        output: [eval]
                    })
                }
            }
        }

        console.log("Training Now")

        const net = new brain.NeuralNetwork({
            hiddenLayers: [50],
            errorThresh: 0.0005,
            iterations: 100,
        })

        console.log(trainingData)

        net.train(trainingData, {
            log: (stats) => console.log(stats),
            logPeriod: 1
        })

        console.log("Testing")

        var xyValues = [];
        
        for (let i = 0; i < evaluationData.length; i++){
            console.log(evaluationData[i].output)
            console.log((net.run(evaluationData[i].input)) + "\n\n");
            xyValues.push({x: evaluationData[i].output[0], y: net.run(evaluationData[i].input)})
        }


        new Chart("myChart", {
        type: "scatter",
        data: {
            datasets: [{
            pointRadius: 4,
            pointBackgroundColor: "rgba(0,0,255,1)",
            data: xyValues
            }]
        },
        });
    }

    else { console.log("No File attached"); }
}



// Train model from click
var trainButton = document.getElementById("train");
trainButton.addEventListener('click', trainNN)

console.log("Finished Training Model.\n")
