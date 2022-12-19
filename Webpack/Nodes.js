const { Chess } = require("chess.js");
const eval = require('./Evaluation');

var nodeID = -1
var moveID = -1

function getID() {
    nodeID += 1
    return nodeID
}

function getMoveID() {
    nodeID += 1
    return nodeID
}

class MoveObject {
    constructor(move) {
        this.move = move;
        this.id = getMoveID();
    }
}

class Node {
    constructor(board, parent, moves, WorB, action) {
        this.id = getID();
        this.board = board;
        this.parent = parent;
        this.moves = moves;
        this.moveObjects = []
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
        // console.log("Children: " + Object.keys(this.childrenDict).length)
        // console.log("Moves: " + this.moves.length)
        if (Object.keys(this.childrenDict).length === this.moves.length) return true
        return false
    }

    // Multi-arm bandit
    // Assumes that the node is expanded
    getNext() {

        if (Object.keys(this.childrenDict).length != this.moves.length) {
            console.log("MISTAKE! node requesting next without being expanded first")
            return null
        }

        // Random move
        // var givenMoveObject = this.moveObjects[Math.floor(Math.random() * this.moveObjects.length)]
        var givenMoveObject = this.moveObjects[0]


        var nextNode = this.childrenDict[givenMoveObject.id]

        // // Next board state
        // var nextState = new Chess(this.board.fen())
        // nextState.move(givenMove)
        // var nextMoves = nextState.moves({ verbose: true })

        // var nextNode = new Node(nextState, this, nextMoves, !this.WorB, givenMove)
        return nextNode
    }

    expand() {
        // console.log("\nExpanding: " + this.id)
        for (let i = 0; i < this.moves.length; i++){
            var givenMove = this.moves[i]
            var giveMoveObject = new MoveObject(givenMove);
            this.moveObjects.push(giveMoveObject)

            var nextState = new Chess(this.board.fen())
            nextState.move(givenMove)
            var nextMoves = nextState.moves({ verbose: true })
            var nextNode = new Node(nextState, this, nextMoves, !this.WorB, givenMove)

            this.childrenDict[giveMoveObject.id] = nextNode
        }
    }
}

exports.getNewNode = function getNode(board, parent, moves, WorB, action) {

    var node = new Node(board, parent, moves, WorB, action)
    return node
}