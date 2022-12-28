const { Chess } = require("chess.js");
const eval = require('./Evaluation');

function round(value, decimals) {
    return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
  }

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
    constructor(board, parent, moves, WorB, action, ownerColor) {

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

        this.ownerColor = ownerColor

        this.qValue = eval.pieceValue(this.board, ownerColor);
        // console.log(ownerColor + " <")

        // Used in backpropagation
        this.actionObject = null
        if (parent != null) {
            for (let i = 0; i < parent.moveObjects.length; i++){
                // console.log(parent.moveObjects[i].move)
                // console.log(parent.moves[i])
                // console.log("\n")
                if (parent.moves[i] === action) {
                    this.actionObject = parent.moveObjects[i]
                    break;
                }
            }
        }
        this.bestMoveValue = this.qValue;
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

    getOppColor(color) {
        if (color === 'w') {
            return 'b'
        }

        if (color === 'b') {
            return 'w'
        }

        else {
            console.log("error!")
            return null;
        }
    }

    // Multi-arm bandit
    // Assumes that the node is expanded
    getNext() {

        if (Object.keys(this.childrenDict).length != this.moves.length) {
            console.log("MISTAKE! node requesting next without being expanded first")
            return null
        }

        // EPSILON
        var eps = Math.random()

        var THRESHHOLD = 0.2

        if (this.visits < this.moves.length && false) {
            THRESHHOLD = 1;
        }

        else {
            // console.log("Setting low")
            THRESHHOLD = 0.2
        }

        var givenMoveObject = null;

        if (eps < THRESHHOLD || this.bestMoveObject === null) {
            givenMoveObject = this.moveObjects[Math.floor(Math.random() * this.moveObjects.length)]
            console.log("Giving move: " + givenMoveObject.move.to + " () " + givenMoveObject.move.color)
        }

        else {
            givenMoveObject = this.bestMoveObject
        }

        return this.childrenDict[givenMoveObject.id]

    }

    // Returns the qValue of best node
    // OR qValue of worst node if isOpponent
    expand(AgentWorB) {

        console.log("\nExpanding: " + this.id)

        var minQ = 100;
        var maxQ = -1;
        var bestActionObject = null;
        // console.log("\nStart")
        for (let i = 0; i < this.moves.length; i++){
            var givenMove = this.moves[i]
            var giveMoveObject = new MoveObject(givenMove);
            this.moveObjects.push(giveMoveObject)

            var nextState = new Chess(this.board.fen())
            nextState.move(givenMove)
            var nextMoves = nextState.moves({ verbose: true })

            var nextNode = new Node(nextState, this, nextMoves, !this.WorB, givenMove, this.getOppColor(this.ownerColor))

            // console.log("Move: " + nextNode.action.to + ", Q: " + round(nextNode.qValue, 4))

            if (this.WorB === AgentWorB) {
                if (nextNode.qValue < minQ) {
                    // console.log("Replacing " + minQ + " with " + nextNode.qValue)
                    minQ = nextNode.qValue
                    bestActionObject = giveMoveObject;
                }
            }
            else {
                if (nextNode.qValue > maxQ) {
                    // console.log("Replacing (max)" + maxQ + " with " + nextNode.qValue)
                    maxQ = nextNode.qValue
                    bestActionObject = giveMoveObject;
                }
            }
            this.childrenDict[giveMoveObject.id] = nextNode
        }
        console.log("")

        // Updating best move from this node and value achieved
        this.bestMoveObject = bestActionObject;

        if (this.matchesAgentColor(AgentWorB)) {
            this.bestMoveValue = minQ;
            // console.log("Min: " + minQ)
            return minQ;
        }
        this.bestMoveValue = maxQ;
        // console.log("Max: " + maxQ)
        return maxQ;
    }
}

exports.getNewNode = function getNode(board, parent, moves, WorB, action) {

    var ownedColor = 'b'
    if (WorB) {
        ownedColor = 'w'
    }
    var node = new Node(board, parent, moves, WorB, action, ownedColor)
    return node
}