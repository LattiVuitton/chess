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

        // Visits are only counted during backpropagation
        this.visits = 1;
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

        // Used in backpropagation
        this.bestMoveObject = null;
        this.bestMoveValue = null;
    }

    fullyExplored() {
        if (Object.keys(this.childrenDict).length === this.moves.length) {
            return true
        }
        return false
    }

    hasNoMoves() {
        if (this.moves.length === 0) return true
        return false
    }

    matchesAgentColor(agentColor) {
        if (this.WorB === agentColor) {
            return true;
        }
        return false;
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

        // console.log(givenMoveObject.id)
        // console.log("^Hm")
        // console.log(this.childrenDict[givenMoveObject.id])
        var nextNode = this.childrenDict[givenMoveObject.id]

        // // Next board state
        // var nextState = new Chess(this.board.fen())
        // nextState.move(givenMove)
        // var nextMoves = nextState.moves({ verbose: true })

        // var nextNode = new Node(nextState, this, nextMoves, !this.WorB, givenMove)
        return nextNode
    }

    // Returns the qValue of best node
    // OR qValue of worst node if isOpponent
    expand(AgentWorB) {
        var minQ = 1
        var maxQ = -1
        var bestActionObject = null;
        for (let i = 0; i < this.moves.length; i++){
            var givenMove = this.moves[i]
            var giveMoveObject = new MoveObject(givenMove);
            this.moveObjects.push(giveMoveObject)

            var nextState = new Chess(this.board.fen())
            nextState.move(givenMove)
            var nextMoves = nextState.moves({ verbose: true })
            var nextNode = new Node(nextState, this, nextMoves, !this.WorB, givenMove)
            if (this.WorB === AgentWorB) {
                if (nextNode.qValue < minQ) {
                    minQ = nextNode.qValue
                    bestActionObject = giveMoveObject;
                }
            }
            else {
                if (nextNode.qValue > maxQ) {
                    maxQ = nextNode.qValue
                    bestActionObject = giveMoveObject;
                }
            }
            this.childrenDict[giveMoveObject.id] = nextNode
        }

        // Updating best move from this node and value achieved
        this.bestMoveObject = bestActionObject;
            
        if (this.matchesAgentColor) {
            this.bestMoveValue = minQ;
            return minQ;
        }
        this.bestMoveValue = maxQ;
        return maxQ;

    }
}

exports.getNewNode = function getNode(board, parent, moves, WorB, action) {

    var node = new Node(board, parent, moves, WorB, action)
    return node
}