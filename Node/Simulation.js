const chess = require('chess.js');
const { count } = require('console');
var eval = require('./Evaluation');

// class Agent{
//     constructor(WOrB) {
//         // True = White
//         this.WOrB = WOrB
//     }

//     selectMove(board, moves) {
//         return random(moves)
//     }
// }

class Node{
    constructor(id, board, parent) {
        this.id = id;
        this.board = board;
        this.parent = parent;
    }
}

var game = new chess.Chess()

console.log('Test: ' + eval.evaluateBoard(game))