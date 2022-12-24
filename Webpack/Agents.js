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
        this.playerBoardState = null;

        this.MAX_PATH_LENGTH = 1000
        if (WorB) {
            this.turn = 1
        }
        else {
            this.turn = 2
        }
    }

    setRootNode(lastPlayerMove) {
        // console.log(lastPlayerMove + " <--")
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

        // console.log("Improving tree")

        var path = [this.rootNode]
        var activeNode = this.rootNode

        var expansionNeeded = true;
        var foundWin = false;
        var foundLoss = false;
        var foundDraw = false;
        
        // Selection
        while (activeNode.fullyExplored()) {

            if (activeNode.hasNoMoves()) {
                expansionNeeded = false;
                if (activeNode.board.isCheckmate()) {
                    if (activeNode.color === this.WorB) {
                        foundWin = true;
                    }
                    else {
                        foundLoss = true;
                    }
                }
                else {
                    foundDraw = true  
                }
                break;
            }

            if (path.length > this.MAX_PATH_LENGTH) {
                expansionNeeded = false;
                break;
            }

            activeNode = activeNode.getNext()
            path.push(activeNode)

            // Adding to total visitations
            if (!this.nodeVisited(activeNode.id)) {
                this.allExpandedNodes.push(activeNode.id)
            }
        }

        // console.log("Path Length: " + path.length)

        var foundValue = 0

        // Expansion
        if (expansionNeeded) {
            foundValue = activeNode.expand(this.WorB)
        }

        else if (foundDraw) {
            foundValue = 0.5
        }

        else if (foundWin) {
            foundValue = 1
        }

        else if (foundLoss) {
            foundValue = 0
        }

        // Backprop
        for (let j = path.length - 1; j >= 0; j--) {
            var rat = path[j].qValue
            path[j].qValue = ((path[j].qValue * path[j].visits) + foundValue) / (path[j].visits + 1)
            path[j].visits++
        }
    }

    selectMove(board, moves) {

        console.log("Selecting\n")

        this.allExpandedNodes = []

        var foundRootNode = false;

        if (this.playerAvailableMoves != null) {
            for (let i = 0; i < this.playerAvailableMoves.length; i++){
                var playerMove = this.playerAvailableMoves[i];
                var boardAfterPlayer = new Chess(this.playerBoardState.board.fen())
                boardAfterPlayer.move(playerMove.move)

                if (boardAfterPlayer.fen() === board.fen()) {
                    if (this.playerBoardState != null) {
                        this.rootNode = this.playerBoardState.childrenDict[playerMove.id]
                        foundRootNode = true;
                    }
                }
            }
        }

        // Root node returned is faulty OR couldnt retrieve root
        if (this.rootNode === null || !foundRootNode) {
            console.log("Couldnt retrieve")
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
        console.log(this.rootNode.id + " < root ID")

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
        for (let i = 0; i < playerState.moveObjects.length; i++){

            // Add move to player moves
            this.playerAvailableMoves.push(playerState.moveObjects[i]);
        }

        // Board state being left to player
        this.playerBoardState = playerState;
        
        // Best move after Q-value analysis
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