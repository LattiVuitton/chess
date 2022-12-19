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
        this.childrenDict = new Object();
        this.WorB = WorB;
        this.action = action
        var color = 'b';
        if (WorB) {
            color = 'w';
        }
        this.qValue = eval.pieceValue(this.board, color);
    }

    fullyExplored() {
        // console.log("Children: " + this.children)
        // console.log("Moves: " + this.moves)
        if (Object.keys(this.childrenDict).length === this.moves.length) return true
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
        console.log("Expanding: " + this.id)
        for (let i = 0; i < this.moves.length; i++){
            const givenMove = this.moves[i]
            var nextState = new Chess(this.board.fen())
            nextState.move(givenMove)
            var nextMoves = nextState.moves({ verbose: true })
            var nextNode = new Node(nextState, this, nextMoves, !this.WorB, givenMove)

            console.log("\n\nChildren 1: " + this.children)
            if (!this.children[givenMove]) {
                this.children[givenMove] = 0
                console.log("WERC")
            }
            this.children[givenMove] = nextNode
            console.log("Children 2: " + this.children)

        }
    }

}

exports.getNewNode = function getNode(board, parent, moves, WorB, action) {

    var node = new Node(board, parent, moves, WorB, action)
    return node
}