const { Chess } = require("chess.js");
const eval = require('./Evaluation');

function round(value, decimals) {
    return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
}

function invertEval(original) {
    if (original >= 0 && original <= 1) return 1 - original
    return null
}

var nodeID = -1
var moveID = -1

function getID() {
    nodeID++
    return nodeID
}

function getMoveID() {
    moveID++
    return moveID
}

class MoveObject {
    constructor(move) {
        this.move = move;
        this.id = getMoveID();
    }
}

class Node {

    updateNodeValue(newValue) {
        this.qValue = newValue;
    }

    constructor(board, parent, moves, WorB, action, isComp) {

        // Visits are only counted during backpropagation
        this.visits = 1;
        this.nextMoveIndex = 0;
        this.id = getID();
        this.board = board;
        this.parent = parent;
        this.moves = moves;
        this.moveObjects = []
        this.childrenDict = new Object();
        this.WorB = WorB;
        this.action = action;

        this.ownerColor = 'b';

        if (WorB) {
            this.ownerColor = 'w';
        }

        // Evaluation is relative to the colour of the node.
        // E.g. black node with high black piece count has q > 0.5,
        //      irrespective of whether the node is a human or not.
        var tempQ = eval.pieceValue(this.board, this.ownerColor);

        // this.bestMoveValue = this.qValue;
        // console.log("From node creation")
        this.updateNodeValue(tempQ)

        // Used in backpropagation
        this.actionObject = null
        if (parent != null) {
            for (let i = 0; i < parent.moveObjects.length; i++){
                if (parent.moves[i] === action) {
                    this.actionObject = parent.moveObjects[i]
                    break;
                }
            }
        }
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

        var givenMoveObject = null;

        if (eps < THRESHHOLD || this.bestMoveObject === null) {
            // givenMoveObject = this.moveObjects[0]
            givenMoveObject = this.moveObjects[Math.floor(Math.random() * this.moveObjects.length)]
        }

        else {
            givenMoveObject = this.bestMoveObject
        }
        
        return this.childrenDict[givenMoveObject.id]

    }

    expand(AgentWorB) {

        // console.log("\nExpanding: " + this.id)

        var maxQ = -2;
        var bestActionObject = null;

        for (let i = 0; i < this.moves.length; i++){
            var givenMove = this.moves[i]
            var giveMoveObject = new MoveObject(givenMove);
            this.moveObjects.push(giveMoveObject)

            var nextState = new Chess(this.board.fen())
            nextState.move(givenMove)
            var nextMoves = nextState.moves({ verbose: true })

            // var nextNode = new Node(nextState, this, nextMoves, !this.WorB, givenMove, this.getOppColor(this.ownerColor))
            var nextNode = new Node(nextState, this, nextMoves, !this.WorB, givenMove, true)

            // Since the next node is always an opponent,
            //      it has opposite evaluation, (0.2 vs 0.8 for same board)
            if (invertEval(nextNode.qValue) > maxQ) {
                    maxQ = invertEval(nextNode.qValue)
                    bestActionObject = giveMoveObject;
                }

            this.childrenDict[giveMoveObject.id] = nextNode
        }

        // Updating best move from this node and value achieved
        this.bestMoveObject = bestActionObject;

        // Updating node value
        this.updateNodeValue(maxQ)

        // For use in backprop
        return maxQ;
    }
}

exports.getNewRoot = function getNode(board, parent, moves, WorB, action) {

    var ownedColor = 'b'
    if (WorB) {
        ownedColor = 'w'
    }

    var node = new Node(board, parent, moves, WorB, action, true)
    return node
}