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

class MCTSAgent extends Agent{
    constructor(id, WorB) {
        super(id, WorB)
        this.requiresVerbose = true
        this.rootNode = null
        this.rootID = -1
        this.allExpandedNodes = []
        this.requiresLastPlayerMove = true;
        this.offlineTreeBuilding = true;
        this.timeLimit = 1;
        this.hasTimeLimit = true;
        this.MIN_ROUNDS = 10;

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

    setTimeLimit(timeLimit) {
        this.timeLimit = timeLimit;
    }

    nodeVisited(nodeID) {
        for (let i = 0; i < this.allExpandedNodes.length; i++){
            if (nodeID === this.allExpandedNodes[i]) {
                return true
            }
        }
        return false
    }

    offlineImproveTree() {
        this.improveTree(true)
    }

    improveTree(offline) {

        // console.log("Improving")

        var searchNode = this.rootNode

        if (offline) {
            if (!searchNode.fullyExplored()) {
                searchNode.expand()
            }
            searchNode = this.rootNode.bandit(0.3)
        }

        var path = [searchNode]
        var activeNode = searchNode

        activeNode.visits++

        var expansionNeeded = true;

        // Selection
        while (activeNode.fullyExplored()) {

            if (activeNode.hasNoMoves()) {
                expansionNeeded = false;
                break;
            }

            if (path.length > this.MAX_PATH_LENGTH) {
                expansionNeeded = false;
                break;
            }

            activeNode = activeNode.bandit()
            activeNode.visits++
            path.push(activeNode)

            // // Adding to total visitations
            // if (!this.nodeVisited(activeNode.id)) {
            //     this.allExpandedNodes.push(activeNode.id)
            // }
        }

        var foundValue = 0

        // Expansion
        if (expansionNeeded) {
            foundValue = activeNode.expand(this.WorB)
        }


        var valueToAgent = 0
        var valueToPlayer = 0

        if (activeNode.matchesAgentColor(this.WorB)) {
            valueToPlayer = invertEval(foundValue);
            valueToAgent = foundValue;
        }

        else {
            valueToAgent = invertEval(foundValue);
            valueToPlayer = foundValue;
        }
        
        // Backprop
        // console.log("")

        // For all nodes except last node in path
        for (let j = path.length - 2; j >= 0; j--) {

            var pathNode = path[j]

            // If node is unexpanded (no children)
            if (!expansionNeeded && j === path.length) {
                console.log("No backprop here")
            }

            else {

                var keyValue = valueToPlayer;

                if (pathNode.matchesAgentColor(this.WorB)) {
                    keyValue = valueToAgent;
                }

                if (keyValue > pathNode.qValue) {
                    if (j === 1) {
                        // console.log("Useful")
                    }
                    pathNode.bestMoveObject = path[j+1].actionObject
                    pathNode.updateNodeValue(keyValue)
                }

                else {
                    break;
                }
            }
        }
        // console.log(path)
    }

    selectMove(board, moves) {

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
            this.rootNode = nodes.getNewRoot(board, null, board.moves({ verbose: true }), this.WorB, null)
            console.log("Couldnt retrieve, giving new: " + this.rootNode.id)
        }

        else {
            console.log("Found!")
        }

        this.turn++

        // Time loop
        var timeLimitSeconds = this.timeLimit * 1000
        const start = Date.now()

        // Think for at least this number of rounds
        // Required for avoiding no child expansion
        var roundsCount = 0

        while (Date.now() - start < timeLimitSeconds || roundsCount < this.MIN_ROUNDS) {
            roundsCount++
            this.improveTree(false)
        }

        var bestMove = null
        var bestQ = -1
        var playerState = null

        // For clean code
        var dictLen = Object.keys(this.rootNode.moveObjects).length

        for (let i = 0; i < dictLen; i++) {
            var moveObject = this.rootNode.moveObjects[i]

            var opponentNode = this.rootNode.childrenDict[moveObject.id]

            console.log("\nMove: " + moveObject.move.to)
            console.log("Value: " + round(invertEval(opponentNode.qValue), 4))
            console.log("Visits: " + opponentNode.visits)

            if (invertEval(opponentNode.qValue) > bestQ) {
                bestMove = moveObject.move;
                bestQ = invertEval(opponentNode.qValue);
                playerState = opponentNode;
            }
        }

        if (!playerState.fullyExplored()) {
            // playerState.expand()
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
        this.rootNode = playerState
        
        // Best move after Q-value analysis
        // console.log(round(bestQ,4))

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
        // Designed to ensure each move is trialled
        this.MIN_ROUNDS = 100;

        // Board constantly being updated
        this.testGame;

        // Moves the player will choose from
        // And copy of previous board
        this.playerMoves = null;
        this.previousBoard = null;
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
                        this.testGame.undo(path[j].action);

                        // Visit node
                        path[j].visits++;
                    }

                    // No further checks needed in this path
                    break;
                }
            }
        }
    }

    // Main selection function for agent
    selectMove(board, moves) {

        // Time loop
        const start = Date.now();

        // Think for at least this number of rounds
        // Required for avoiding no child expansion
        var roundsCount = 0;

        // Old root could not be recovered
        let newRootRequired = true;

        // If player moves and previous board are stored
        if (this.playerMoves != null || this.previousBoard != null) {

            // Create new testing chess board
            let tempChess = new Chess(this.previousBoard.fen())

            // Test each player move
            for (let i = 0; i < this.playerMoves.length; i++){

                // Make the player move
                tempChess.move(this.playerMoves[i])

                // Check if new board matches FEN of delivered board
                if (tempChess.fen() === board.fen()) {

                    // Don't create new root
                    newRootRequired = false;

                    // Recover root node
                    this.rootNode = this.rootNode.children[this.playerMoves[i]]

                    // Set compulsory board storage
                    // Only required for roots
                    this.rootNode.board = board;
                }

                // Undo the player move
                tempChess.undo(this.playerMoves[i])
            }
        }

        // If root could not be recovered
        if (newRootRequired) {

            // Create new root node
            this.rootNode = nodes.getLightNode(null, this.WorB, null, board);
        }

        // Create test game based on the given board
        this.testGame = new Chess(this.rootNode.board.fen());

        // Reset
        this.nodesGenerated = 0;

        // Run time loop
        while (Date.now() - start < (this.timeLimit * 1000) || roundsCount < this.MIN_ROUNDS) {

            // Increment and improve tree
            roundsCount++;
            this.improveTree();
        }

        // Best moves for final search
        let bestQValue = -1;
        let bestAction = null;

        // Each child will be discovered by this point
        for (var moveKey in this.rootNode.children) {;
            // console.log("\nMove: " + moveKey);
            // console.log("Value: " + this.invertQvalue(this.rootNode.children[moveKey].qValue));
            // console.log("Visits: " + this.rootNode.children[moveKey].visits);

            // If new move is better
            if (this.invertQvalue(this.rootNode.children[moveKey].qValue) > bestQValue) {

                // Set new action and value
                bestAction = moveKey;
                bestQValue = this.invertQvalue(this.rootNode.children[moveKey].qValue);
            }
        }
        console.log("Count: " + this.nodesGenerated);

        // Set root node and player moves based on the action we have selected
        this.playerMoves = this.rootNode.children[bestAction].moves;
        this.previousBoard = new Chess(this.rootNode.board.fen());
        this.previousBoard.move(bestAction)
        this.rootNode = this.rootNode.children[bestAction];

        // Return action to main app
        return bestAction;
    }
}

// All useable agents exist in the dictionary
var agentTypesDict = {
    
    // Key/value pairs with string as key
    "random": RandomAgent,
    "alwaysTake": AlwaysTake,
    "greedy": GreedyAgent,
    "MCTS": MCTSAgent,
    "LightMCTS": LightMCTS
};

// Returns agent as an object
exports.getAgent = function getAgentType(agentType, id, WorB) {

    // Valid names possible
    const validAgentNames = Object.keys(agentTypesDict)

    // Go through dictionary keys
    for (var i = 0; i < validAgentNames.length; i++){

        // Check for match
        if (validAgentNames[i] === agentType) {

            // Instantiate and return agent
            const agent = new agentTypesDict[agentType](id, WorB)
            return agent
        }
    }

    // Invalid name given
    return null
}