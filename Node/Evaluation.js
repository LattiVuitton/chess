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