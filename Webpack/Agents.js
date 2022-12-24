const { Chess } = require("chess.js");
const eval = require('./Evaluation');
const nodes = require('./Nodes');

class Agent{
    constructor(id, WorB) {
        this.id = id;
        this.WorB = WorB
        this.requiresVerbose = true
        this.requiresLastPlayerMove = false;
    }

    // moves can either be only names, or full move object array
    selectMove(board, moves) {
        return null
    }
}

class RandomAgent extends Agent{
    constructor(id, WorB) {
        super(id, WorB)
        this.requiresVerbose = false
    }

    selectMove(board, moves) {
        const move = null //moves[Math.floor(Math.random() * moves.length)]
        return move
    }
}

class AlwaysTake extends Agent{
    constructor(id, WorB) {
        super(id, WorB)
        this.requiresVerbose = true
    }

    selectMove(board, moves) {

        // If you can checkmate, do it
        for (let i = 0; i < moves.length; i++){
            const move = moves[i];
            var clonedBoard = new Chess(board.fen())
            clonedBoard.move(move)
            if (clonedBoard.isCheckmate()) {
                return move
            }
        }

        // If you can take a piece, do it
        for (let i = 0; i < moves.length; i++){
            const move = moves[i];
            if (board.get(move.to) != false) {
                return move
            }
        }

        // If you can check, do it
        for (let i = 0; i < moves.length; i++){
            const move = moves[i];
            var clonedBoard = new Chess(board.fen())
            clonedBoard.move(move)
            if (clonedBoard.isCheck()) {

                return move
            }
        }

        const move = moves[Math.floor(Math.random() * moves.length)]
        return move
    }
}

class GreedyAgent extends Agent{
    constructor(id, WorB) {
        super(id, WorB)
        this.requiresVerbose = true
        this.boardsGenerated = 0
    }   

    selectMove(board, moves) {
        var color = 'b'
        if (this.WorB) {
            color = 'w'
        }

        var bestMove = null
        var bestMoveValue = -1
        for (let i = 0; i < moves.length; i++){
            var clonedBoard = new Chess(board.fen())
            this.boardsGenerated += 1
            const move = moves[i]
            clonedBoard.move(move)

            // Using piece value evaluation
            const boardValue = eval.pieceValue(clonedBoard, color)

            if (boardValue > bestMoveValue) {
                bestMove = move
                bestMoveValue = boardValue
            }
        }

        return bestMove
    }
}

class MCTSAgent extends Agent{
    constructor(id, WorB) {
        super(id, WorB)
        this.requiresVerbose = true
        this.rootNode = null
        this.rootID = -1
        this.allExpandedNodes = []
        this.requiresLastPlayerMove = true;

        // Indicates what the opponent (human) is faced with at close
        // Used to retrieve tree from previous state
        // Value changes at the end of each move
        this.playerAvailableMoves = null;
        if (WorB) {
            this.turn = 1
        }
        else {
            this.turn = 2
        }
    }

    setRootNode(lastPlayerMove) {
        console.log(lastPlayerMove + " <--")
    }

    nodeVisited(nodeID) {
        for (let i = 0; i < this.allExpandedNodes.length; i++){
            if (nodeID === this.allExpandedNodes[i]) {
                return true
            }
        }
        return false
    }

    improveTree() {

        console.log("Improving")

        var path = [this.rootNode]
        var activeNode = this.rootNode
        
        // Selection
        while (activeNode.fullyExplored()) {
            activeNode = activeNode.getNext()
            path.push(activeNode)

            // Adding to total visitations
            if (!this.nodeVisited(activeNode.id)) {
                this.allExpandedNodes.push(activeNode.id)
            }
        }

        // console.log("Path Length: " + path.length)

        // Expansion
        activeNode.expand()
    }

    selectMove(board, moves) {

        this.allExpandedNodes = []

        // If first move
        if (this.turn <= 2) {
            this.rootNode = nodes.getNewNode(board, null, board.moves({ verbose: true }), this.WorB, null)
        }

        else {
            this.rootNode = nodes.getNewNode(board, null, board.moves({ verbose: true }), this.WorB, null)
        }

        this.turn++

        // Time loop
        const timeLimit = 1
        const timeLimitSeconds = timeLimit * 1000
        const start = Date.now()
        while (Date.now() - start < timeLimitSeconds) {
            this.improveTree()
        }

        var bestMove = null
        var bestQ = -1
        var playerState = null

        // For clean code
        var dictLen = Object.keys(this.rootNode.moveObjects).length

        for (let i = 0; i < dictLen; i++) {
            var moveObject = this.rootNode.moveObjects[i]

            var opponentNode = this.rootNode.childrenDict[moveObject.id]

            if (opponentNode.qValue > bestQ) {
                bestMove = moveObject.move;
                bestQ = opponentNode.qValue;
                playerState = opponentNode;
            }
        }

        // Clear moves available to opponent (human)
        this.playerAvailableMoves = []

        // State of board being delivered to opponent
        for (let i = 0; i < playerState.moves.length; i++){

            // Add move to player moves
            this.playerAvailableMoves.push(playerState.moves[i]);
        }

        return bestMove
    }
}

var agentTypesDict = {
    "random": RandomAgent,
    "alwaysTake": AlwaysTake,
    "greedy": GreedyAgent,
    "MCTS": MCTSAgent
};


exports.getAgent = function getAgentType(agentType, id, WorB) {

    const validAgentNames = Object.keys(agentTypesDict)

    for (var i = 0; i < validAgentNames.length; i++){

        if (validAgentNames[i] === agentType) {
            const agent = new agentTypesDict[agentType](id, WorB)
            return agent
        }
    }

    return null
}