const { Chess } = require("chess.js");
const eval = require('./Evaluation');
const nodes = require('./Nodes');

function round(value, decimals) {
    return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
}
  
function invertEval(original) {
    if (original >= 0 && original <= 1) return 1 - original
    return null
}

class Agent{
    constructor(id, WorB) {
        this.id = id;
        this.WorB = WorB
        this.requiresVerbose = true
        this.requiresLastPlayerMove = false;
        this.offlineTreeBuilding = false;
        this.hasTimeLimit = false;
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
            // Previous action and evaluation irrelevant here
            const boardValue = eval.pieceValue(clonedBoard, color, null, 0)

            if (boardValue > bestMoveValue) {
                bestMove = move
                bestMoveValue = boardValue
            }
        }

        return bestMove
    }
}

class LightMCTS extends Agent{

    // Only set ID and Color from super
    constructor(id, WorB) {

        // Default
        super(id, WorB);

        // Not really required, but useful in debugging
        this.requiresVerbose = true;

        // Set after move or recovered from previous moves
        this.rootNode = null;

        // Allows tree to be built whilst human is thinking
        this.offlineTreeBuilding = true;

        // Set by player throughout
        // Changeable even mid-game
        this.timeLimit = 1;

        // Required for app class
        this.hasTimeLimit = true;

        // Required for ultra-low time limit scenarios
        this.MIN_ROUNDS = 10;

        // Board constantly being updated
        this.testGame;
    }

    // Set dynamically, including during round
    setTimeLimit(timeLimit) {
        this.timeLimit = timeLimit;
    }

    // All Q-values are for the node's owner
    // Opponent board Q-values must be inverted
    invertQvalue(value) {

        // Assumes valid value given
        return 1 - value;
    }

    // Called per frame / as fast as device is capable
    offlineImproveTree() {

        // Main improvement function
        // this.improveTree(true)
    }

    // Always expands exactly one new node
    // Depth of this node depends on tree structure
    improveTree() {

        // Not necessary
        // Counts how many nodes are expanded
        // Value is reset after every computer move
        if (this.nodesGenerated === undefined) {

            // Initialise
            this.nodesGenerated = 0;
        }
        else {

            // Increment
            this.nodesGenerated++;
        }

        // Root node should be discovered by this point
        // Path is created from the root of the tree
        let searchNode = this.rootNode;
        let path = [searchNode];

        // Until new unvisited node is found
        while (searchNode.visits > 0) {

            // Temporary variable for next node in path
            let next = searchNode.bandit();

            // No moves available
            // Search node is a terminal node
            if (next === -1) {

                // Stop searching from here
                break;
            }

            // Add next node as the search node
            searchNode = next;

            // Add next node to the path
            path.push(searchNode);

            // Using our actual board implementation
            // Perform discovered move
            this.testGame.move(searchNode.action);
        }

        // Q-value of final node's parent
        let preQ = -1;

        // If search node is first in the tree
        if (searchNode.parent != undefined) {

            // Retrieving parent value through node data structure
            preQ = searchNode.parent.qValue;
        }

        // Nodes are usually not discovered yet
        if (!searchNode.movesDiscoverd) {

            // Discover moves at this stage
            searchNode.discoverMoves(this.testGame.moves());
            searchNode.movesDiscoverd = true;
        }

        // Only occurs if a terminal state has been reached
        // Node has already been searched, and has no next state
        else {

            // No backprop can be performed here
            // Since minimax-like algorithm is being used
            return;
        }

        // If end node has no moves (guaranteed discovered)
        if (searchNode.moves.length === 0) {

            // Checkmate
            if (this.testGame.isCheckmate()) {

                // Always 0 since it is that node's turn
                searchNode.setQValue(0);
            }

            // Draw
            else {

                // 0.5 for either player
                searchNode.setQValue(0.5);
            }
        }

        // Node has valid moves
        else {

            // Evaluate and set the node
            // Use the preQ only if board value is being used (not NN)
            searchNode.setQValue(eval.getQValue(this.testGame, searchNode.action, preQ, searchNode.WorB));
        }

        // Going backwards through the path
        for (let i = path.length - 1; i >= 0; i--){

            // Undo move from the test board
            // Save on data storage through no copies
            this.testGame.undo(path[i].action);

            // Visit node
            path[i].visits++;

            // Except for the final node
            if (i < path.length - 1) {

                // Update value if better move has been discovered
                if (this.invertQvalue(path[i + 1].qValue) > path[i].qValue) {

                    // Update node value
                    path[i].qValue = this.invertQvalue(path[i + 1].qValue);
                }

                // No update occurs
                // No further updates can occur upstream
                else {

                    // For remaining path
                    for (let j = i - 1; j >= 0; j--){

                        // Undo move from the test board
                        this.testGame.undo(path[i].action);

                        // Visit node
                        path[i].visits++;
                    }

                    // No further checks needed in this path
                    break;
                }
            }
        }
    }

    selectMove(board, moves) {

        this.turn++

        // Time loop
        const start = Date.now()

        // Think for at least this number of rounds
        // Required for avoiding no child expansion
        var roundsCount = 0

        this.rootNode = nodes.getLightNode(null, this.WorB, null, board);
        this.testGame = new Chess(this.rootNode.board.fen());

        this.nodesGenerated = 0;

        while (Date.now() - start < (this.timeLimit * 1000) || roundsCount < this.MIN_ROUNDS) {
            roundsCount++
            this.improveTree()
        }

        var counting = 0;

        let bestQValue = -1;
        let bestAction = null;

        console.log("-----------------------------\n")

        for (var moveKey in this.rootNode.children) {
            // console.log("\nMove: " + moveKey)
            // console.log("Value: " + this.invertQvalue(this.rootNode.children[moveKey].qValue))
            // console.log("Visits: " + this.rootNode.children[moveKey].visits)
            counting += this.rootNode.children[moveKey].visits

            if (this.invertQvalue(this.rootNode.children[moveKey].qValue) > bestQValue) {
                bestAction = moveKey;
                bestQValue = this.invertQvalue(this.rootNode.children[moveKey].qValue);
            }
        }
        console.log("Count: " + this.nodesGenerated)

        return bestAction
    }
}

var agentTypesDict = {
    "random": RandomAgent,
    "alwaysTake": AlwaysTake,
    "greedy": GreedyAgent,
    "MCTS": MCTSAgent,
    "LightMCTS": LightMCTS
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