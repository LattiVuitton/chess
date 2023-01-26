console.log("\nTraining Model...")

// Ensure checkmate always stays more valuable than position
const CHECKMATE_GAMMA = 0.9;

// Brain data structure
const brain = require('brain.js');

// Actual csv file
var csvFile = null;

// Read CSV data
var fileInput = document.getElementById("csv"),

    readFile = function () {

        console.log("Reading")
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

    // Multiply by leeway to keep under checkmate value of 1
    return CHECKMATE_GAMMA * (value - min) / (max - min)
}

// Training function
function trainNN() {

    // Main NN
    const network = new brain.NeuralNetwork();

    // If valid csv
    if (csvFile != null) {
        console.log("Look")
        
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

        console.log(csvArray)

        // Index Notes:
        // 0: FEN
        // Evaluation
        // Data source: Kaggle
        // https://www.kaggle.com/datasets/ronakbadhe/chess-evaluations
        
        var sum = 0;

        // NOTES
        // net.train(ARRAY)
        // log: (error) => console.log(error),
        // logPeroid: 100

        // Iterate
        for (let i = 0; i < Math.min(100, csvArray.length); i++){

            // Only use games with eval we can understand
            let eval = String.slice(1,csvArray[i][1].length) //csvArray[i][1]

            console.log("Output: " + +eval);
        }

        console.log("Sum of evals: " + sum)
    }

    else { console.log("No File attached"); }
}

// Train model from click
var trainButton = document.getElementById("train");
trainButton.addEventListener('click', trainNN)

console.log("Finished Training Model.\n")
