exports.evaluateBoard = function evaluate(game) {

    // Evaluation
    return -2
}

var highest = 0

// ARTIFICIAL COST
function artificialCost(cost) {
    // Artificial Cost
    var count = 0
    for (let i = 0; i < cost; i++){
        denominator = Math.random()
        count += (denominator - 0.5)
    }
    
    if (1 / count > 100000) {
        console.log("A miracle: " + (1/count))
    }
}

// Old piece counting function
exports.pieceValue = function countPieces(game, nodeColor, action, preEval) {

    var pieceTaken = false;

    if (action != null) {
        stringSan = action.san.split("")
        for (let i = 0; i < stringSan.length; i++){
            if (stringSan[i] === 'x') {
                pieceTaken = true;
            }
        }
    }

    if (!pieceTaken && preEval >= 0 && preEval <= 1) {
        return preEval
    }
    
    var myScore = 0
    var oppScore = 0

    // myColor = 'b'
    // if (nodeColor === 'b') {
    //     myColor = 'w'
    // }
    var myColor = nodeColor

    var tilesList = []
    for (let i = 0; i < letters.length; i++){
        for (let j = 1; j < letters.length + 1; j++){
            // artificialCost(1000)
            tile = letters[i] + j
            tilesList.push(tile)
            piece = game.get(tile)
            if (piece != false) {
                if (piece.color === myColor) {
                    myScore += pieceValues[piece.type]
                }
                else {
                    oppScore += pieceValues[piece.type]
                }
            }
        }
    }
    return (myScore + Number.EPSILON) / (myScore + oppScore + Number.EPSILON)
}

exports.getCount = function () {
    return boardsEvaluated
}


// Used for light nodes
exports.getQValue = function evaluateBoard(game, action, preEval, WorB) {

    boardsEvaluated++

    pieceTaken = false;

    if (WorB) {
        myColor = 'w';
    }

    else {
        myColor = 'b';
    }

    if (action != null) {
        stringSan = action.split("")
        for (let i = 1; i < stringSan.length; i++){
            if (stringSan[i] === 'x') {
                pieceTaken = true;
                break;
            }
        }
    }

    if (!pieceTaken && preEval >= 0 && preEval <= 1) {
        return 1 - preEval
    } 
    
    myScore = 0
    opScore = 0

    tilesList = []
    for (let i = 0; i < letters.length; i++){
        for (let j = 1; j < letters.length + 1; j++){
            tile = letters[i] + j
            tilesList.push(tile)
            piece = game.get(tile)
            if (piece != false) {
                if (piece.color === myColor) {
                    myScore += pieceValues[piece.type]
                }
                else {
                    opScore += pieceValues[piece.type]
                }
            }
        }
    }
    // console.log(nodeColor + ": " + (myScore + Number.EPSILON) / (myScore + oppScore + Number.EPSILON))
    // console.log("ME: " + whiteScore + " them: " + blackScore)
    // return (myScore / (myScore + oppScore))
    return (myScore + Number.EPSILON) / (myScore + opScore + Number.EPSILON)
}

exports.NN = function NeuralNet(game, action, preEval, WorB) {
    return Math.random();
}