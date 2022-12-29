// const printHello = require('./print-hello');
var agents = require('./Agents');

// No timeout on certain moves
const TIMEOUT = 0;
// Used to cover piece moves
const COVER_TIMEOUT = 500;

var opponent = agents.getAgent("random", 0, true);

const BOARD_WIDTH = 8;

var board = null

var waitingForComputer = false;
var boardReady = false;
var canPickUp = true;

const chess = require('chess.js')
var game = new chess.Chess()

var agentID = 0

function getID() {
    agentID++
    return agentID
}

function setOpponent(style) {
    opponent = agents.getAgent(style, getID, !WorB)
}

// Variable stopping tree improvement during piece lift
var treeBuildingAllowed = true;
function onDragStart(source, piece, position, orientation) {

    treeBuildingAllowed = false;

    // do not pick up pieces if the game is over
    if (game.isGameOver()) return false
    if (!canPickUp) return false

    if (WorB && (piece.search(/^b/) !== -1)) return false
    if (!WorB && (piece.search(/^w/) !== -1)) return false

}
  
function makeRandomMove () {
var possibleMoves = game.moves()

// game over
if (possibleMoves.length === 0) return

var randomIdx = Math.floor(Math.random() * possibleMoves.length)
game.move(possibleMoves[randomIdx])
}

// Storing the most recent player move
// Only needed for MCTS agent
var lastPlayerMove = null
function onDrop(source, target) {
    
    gameActive = true

    var promoting = false;
    var newMove = null;

    // Checking if move is a promotion
    firstLetter = target.split("")[1];
    if (firstLetter === BOARD_WIDTH.toString() || firstLetter === "1") {
        piece = game.get(source);
        if (piece.type === 'p') {
            promoting = true;
            newMove = game.move({
                from: source,
                to: target,
                promotion: 'q'
            })
        }
    }


    if (!promoting) {
        newMove = game.move({
            from: source,
            to: target
          })
    }

    // illegal move
    if (newMove === null) {
        treeBuildingAllowed = true;
        return 'snapback'
    }

    // Check for end of game
    if (game.isGameOver()) {
        console.log("Game over")
    }

    else {
        // Move using active agent
        waitingForComputer = true
    }

    lastPlayerMove = newMove

    boardReady = false;
    canPickUp = false;

    window.setTimeout(updateBoard, TIMEOUT)
}


  
var config = {
draggable: true,
position: 'start',
onDragStart: onDragStart,
onDrop: onDrop,
}

board = Chessboard('myBoard', config)

var WorB = true;

var simulateButton = document.getElementById("CompVComp");
var colorButton = document.getElementById("colorButton");

simulateButton.addEventListener("click", function () {
    simulateGame()
}, false);

colorButton.addEventListener("click", function () {
    swapColor()
}, false);

// Agent listeners --------------------------- start
var randomAgent = document.getElementById("randomAgent");
var heuristicAgent = document.getElementById("heuristicAgent");
var MCTSAgent = document.getElementById("MCTSAgent");

randomAgent.addEventListener("click", function () {
    changeAgent("random")
}, false);

heuristicAgent.addEventListener("click", function () {
    changeAgent("heuristic")
}, false);

MCTSAgent.addEventListener("click", function () {
    changeAgent("MCTS")
}, false);

// Auto set MCTS
changeAgent("MCTS")

function changeAgent(agentName) {
    if (!gameActive) {

        var foundAgent = true

        if (agentName === "random") {
            setOpponent("random")
        }

        else if (agentName === "heuristic") {
            setOpponent("alwaysTake")
        }

        else if (agentName === "MCTS") {
            setOpponent("MCTS")
        }
        
        else {
            foundAgent = false
        }

        if (foundAgent) {
            console.log("Changing agent to '" + agentName + "'")
        }
    }
}

// Agent listeners --------------------------- end

function swapColor() {
    if (gameActive) {
        return
    }

    opponent.WorB = WorB;
    WorB = !WorB;

    var color = "White"
    if (!WorB) {
        var config = {
            draggable: true,
            position: 'start',
            orientation: 'black',
            onDragStart: onDragStart,
            onDrop: onDrop,
            // onSnapEnd: onSnapEnd
          }
        
        board = Chessboard('myBoard', config)
        color = "Black"
        gameActive = true
        window.setTimeout(computerMove(), 250)
        canPickUp = true;
    }
    else {
        var config = {
            draggable: true,
            position: 'start',
            onDragStart: onDragStart,
            onDrop: onDrop,
            // onSnapEnd: onSnapEnd
          }
        
        board = Chessboard('myBoard', config)
        canPickUp = false;
    }
    document.getElementById("playerColor").innerHTML="Playing as: " + color
}

function simulateGame() {
        
    const agent1 = agents.getAgent("MCTS", 1, true);
    const agent2 = agents.getAgent("random", 2, false);

    agent1Wins = 0
    agent2Wins = 0
    draws = 0

    const roundsToPlay = 5

    for (let i = 0; i < roundsToPlay; i++){

        var game = require('./GameRunner');
        
        const winner = game.runGame(agent1, agent2, true);

        if (winner != null) {
            result = "Player " + winner.id + " Wins";
            if (winner.id === 1) {
                agent1Wins += 1
            }
            else {
                agent2Wins += 1
            }
        }

        else {
            result = "Draw";
            draws += 1
        }
        
        console.log(result);
    }

    const gamesPlayed = agent1Wins + agent2Wins + draws
    const roundingDecimals = 2

    const round = Math.pow(10, roundingDecimals)

    console.log("\nGames Played  :  " + gamesPlayed)
    console.log("Agent " + agent1.id + "       :  " + agent1Wins + " (" + Math.round((100 * agent1Wins / gamesPlayed + Number.EPSILON) * round) / round + " %)")
    console.log("Agent " + agent2.id + "       :  " + agent2Wins + " (" + Math.round((100 * agent2Wins / gamesPlayed + Number.EPSILON) * round) / round + " %)")
    console.log("Draws         :  " + draws + " (" + Math.round((100 * draws / gamesPlayed + Number.EPSILON) * round) / round + " %)")
    console.log("")

}

function updateBoard() {
    board.position(game.fen())
    boardReady = true;
}

function activateTreeBuilding() {
    treeBuildingAllowed = true;
}

function computerMove() {

    // Reset
    moves = null

    // Verbose means chess.js 'move' object
    if (opponent.requiresVerbose) {
        moves = game.moves({ verbose: true })
    }

    // Otherwise, plain move description acceptable
    else {
        moves = game.moves()
    }

    // Get agent move
    nextMove = opponent.selectMove(game, moves)

    // Move in internal game
    game.move(nextMove)

    // Move on front end board
    window.setTimeout(updateBoard, TIMEOUT)

    // Allow player pick up
    canPickUp = true;

    // Allow offline tree building
    window.setTimeout(activateTreeBuilding, COVER_TIMEOUT);
}

var timeCount = 0
var newTime = 0
startDate = Date.now()
window.onload = function() {            
    function test() {
        newTime = ((Date.now() - startDate) / 1000)
        if (newTime > timeCount) {
            timeCount++
        }
        update()
    }
    setInterval(test, 1);
}

var marker = 0
function update() {
    if (waitingForComputer) {
        if (marker < 10) {
            marker++
        }
        else {
            if (boardReady) {
                computerMove()
                // window.setTimeout(computerMove(), 10000)
                waitingForComputer = false;
                marker = 0
            }
        }
    }

    else if (gameActive && opponent.offlineTreeBuilding && treeBuildingAllowed){
        // console.log("Waiting for player")
        opponent.offlineImproveTree()
    }
}

var gameActive = false