const { Chess } = require("chess.js");
const eval = require('./Evaluation');
const nodes = require('./Nodes');

class Agent{
    constructor(id, WorB) {
        this.id = id;
        this.WorB = WorB
        this.requiresVerbose = true
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
        const move = moves[Math.floor(Math.random() * moves.length)]
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
        if (WorB) {
            this.turn = 1
        }
        else {
            this.turn = 2
        }
    }

    improveTree(board, moves)

    selectMove(board, moves) {

        // If first move
        if (this.turn <= 2) {
            var rootNode = nodes.getNewNode(board, null, board.moves({ verbose: true }), this.WorB, null)
        }

        else {
            var rootNode = nodes.getNewNode(board, null, board.moves({ verbose: true }), this.WorB, null)
        }

        this.turn++

        // Time loop
        const timeLimit = 1
        const timeLimitSeconds = timeLimit * 1000
        const start = Date.now()
        var count = 0
        while (Date.now() - start < timeLimitSeconds) {

            count++
            var path = [rootNode]
            var activeNode = rootNode

            var counting = 1
            
            // Selection
            while (activeNode.fullyExplored()) {
                activeNode = activeNode.getNext()
                path.push(activeNode)
            }

            console.log("Path Length: " + path.length + " <> " + count)

            // Expansion
            activeNode.expand()
        }


        var bestMove = null
        var bestQ = 1

        // for (var move in rootNode.children){
        //     var child = rootNode.children[move];
        //     if (child.qValue < bestQ) {
        //         bestQ = child.qValue;
        //         bestMove = child.action;
        //     }
        // }

        // return bestMove

        const move = moves[Math.floor(Math.random() * moves.length)]
        return move
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