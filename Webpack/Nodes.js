const { Chess } = require("chess.js");
const eval = require('./Evaluation');

var nodeID = -1

function getID() {
    nodeID += 1
    return nodeID
}

class Node {
    constructor(board, parent, moves, WorB, action) {
        this.id = getID();
        this.board = board;
        this.parent = parent;
        this.moves = moves;
        this.children = {};
        this.WorB = WorB;
        this.action = action
        var color = 'b';
        if (WorB) {
            color = 'w';
        }
        this.qValue = eval.pieceValue(this.board, color);
    }

    fullyExplored() {
        console.log(this.children)
        console.log(Object.keys(this.children).length)
        if (Object.keys(this.children).length === this.moves.length) return true
        return false
    }

    // Multi-arm bandit
    // Assumes that the node is expanded
    getNext() {

        if (this.children.length != this.moves.length) {
            console.log("MISTAKE! node requesting next without being expanded first")
            return null
        }

        // Random move
        const givenMove = this.moves[Math.floor(Math.random() * this.moves.length)]

        var nextNode = this.children[givenMove]

        // // Next board state
        // var nextState = new Chess(this.board.fen())
        // nextState.move(givenMove)
        // var nextMoves = nextState.moves({ verbose: true })

        // var nextNode = new Node(nextState, this, nextMoves, !this.WorB, givenMove)
        return nextNode
    }

    expand() {
        // console.log("Expanding node")
        for (let i = 0; i < this.moves.length; i++){
            const givenMove = this.moves[i]
            var nextState = new Chess(this.board.fen())
            nextState.move(givenMove)
            var nextMoves = nextState.moves({ verbose: true })
            var nextNode = new Node(nextState, this, nextMoves, !this.WorB, givenMove)

            for (var key in this.children) {
                console.log(key + " <KEY")
            }

            console.log(givenMove)
            console.log(Object.keys(this.children).length + "<--")
            this.children[givenMove] = nextNode
            console.log(Object.keys(this.children).length + "<---")

        }
    }

}

exports.getNewNode = function getNode(board, parent, moves, WorB, action) {

    var node = new Node(board, parent, moves, WorB, action)
    return node
}