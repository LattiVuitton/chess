const letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
const pieceValues = {
    'p': 1,
    'n': 3.05,
    'b': 3.33,
    'r': 5.63,
    'q': 9.5,
    'k': 0
}

exports.evaluateBoard = function evaluate(game) {

    // Artificial Cost
    var count = 0
    for (let i = 0; i < 1000; i++){
        denominator = Math.random()
        count += (denominator - 0.5)
    }

    // Evaluation
    return count
}

exports.pieceValue = function countPieces(game, myColor) {
    
    var myScore = 0
    var oppScore = 0

    var tilesList = []

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
                    oppScore += pieceValues[piece.type]
                }
            }
        }
    }

    return (myScore + Number.EPSILON) / (myScore + oppScore + Number.EPSILON)
}