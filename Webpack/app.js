// const printHello = require('./print-hello');
var agents = require('./Agents');

// No timeout on certain moves
const NO_TIMEOUT = 0;

// Used to cover piece moves
const COVER_TIMEOUT = 50;
const TINY_TIMEOUT = 15;
const LONG_TIMEOUT = 400;

const BOARD_WIDTH = 8;
const STARTING_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

var printMoves = false;
var offlineEnabled = true;
var opponent = agents.getAgent("random", 0, true);

var board = null
var waitingForComputer = false;
var boardReady = false;
var canPickUp = true;

const chess = require('chess.js')
var game = new chess.Chess()

var agentID = 0

var config = {
    draggable: true,
    position: 'start',
    onDragStart: onDragStart,
    onDrop: onDrop,
    }
    
board = Chessboard('myBoard', config)

var WorB = true;
setOpponent("LightMCTS")

// Max/min thinking time
const MIN_TIME = 0.1;
const MAX_TIME = 10;

// Slider object
var slider = document.getElementById("timeSlider")
slider.oninput = function () {
    changeTime( (slider.value/slider.max) * (MAX_TIME - MIN_TIME) + MIN_TIME)
}

// Keeping track of move number
let moveCount = 1;

// HTML buttons
var colorButton = document.getElementById("colorButton");
var resetButton = document.getElementById("resetButton")

// Size management
const SCREEN_FRACTION = 1//0.9;

document.getElementById("gameOver").style.opacity = 0;

function displayGameOver(On) {
    if (On) {
        document.getElementById("gameOver").style.opacity = 100;
    }
    else {
        document.getElementById("gameOver").style.opacity = 0;
    }
}

// Resize HTML elements
function resizeEverything(){

    let subtractHeight = 0;
    subtractHeight += document.getElementById("HeadingDiv").offsetHeight;
    subtractHeight += document.getElementById("FooterDiv").offsetHeight;

    let resizeWidth = Math.min(SCREEN_FRACTION * window.innerWidth, SCREEN_FRACTION * (window.innerHeight - subtractHeight))

    document.getElementById("FooterHolder").style.width = resizeWidth + "px";
    document.getElementById("FooterHolder").style.marginLeft = (window.innerWidth - resizeWidth) / 2 + "px";

    document.getElementById("myBoard").style.width = resizeWidth + "px";

    document.getElementById("colorButton").style.marginLeft = 0 + "px";
    document.getElementById("resetButton").style.marginLeft = (
        resizeWidth - document.getElementById("resetButton").offsetWidth
    ) + "px";

    document.getElementById("gameOver").style.marginLeft =
        (window.innerWidth) / 2 - document.getElementById("gameOver").offsetWidth / 2 + "px"

    document.getElementById("gameOver").style.marginTop = -1 * (resizeWidth/2 + document.getElementById("gameOver").offsetHeight / 2)+ "px"
    
    board.resize()
}

resizeEverything()

window.addEventListener('resize', () => { 
    resizeEverything()
})

// Check for mobile application being used
if (navigator.userAgent.match(/Android/i)
|| navigator.userAgent.match(/webOS/i)
|| navigator.userAgent.match(/iPhone/i)
|| navigator.userAgent.match(/iPad/i)
|| navigator.userAgent.match(/iPod/i)
|| navigator.userAgent.match(/BlackBerry/i)
    || navigator.userAgent.match(/Windows Phone/i)) {
}
else {
}

// Not really necessary given single agent
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

// Computer move
function proceedToComputer() {
    
    treeBuildingAllowed = false;
    gameActive = true

    // Check for end of game
    if (game.isGameOver()) {
        displayGameOver(true)
    }

    else {
        window.setTimeout(setComp, TINY_TIMEOUT)
    }

    boardReady = false;
    canPickUp = false;

    window.setTimeout(updateBoard, TINY_TIMEOUT)
}

// Storing the most recent player move
// Only needed for MCTS agent
function onDrop(source, target) {

    var promoting = false;
    var newMove = null;

    // Checking if move is a promotion
    firstLetter = target.split("")[1];

    // Check for pawn promotion
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

    // In case of promoting 'Queen' is assumed
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

    canPickUp = false;
    if (newMove.san == "O-O" || newMove.san == "O-O-O") {
        // board.position(game.fen())
        window.setTimeout(function () {
            board.position(game.fen())
            window.setTimeout(proceedToComputer,200);

        }, 200);

    }

    else {
        proceedToComputer()
    }
}


function setComp() {
    // Move using active agent
    waitingForComputer = true
}

// HTML button elements
colorButton.addEventListener("click", function () {
    swapColor()
}, false);

resetButton.addEventListener("click", function () {
    resetGame()
}, false);

// Reset board and game object
function resetGame(){
    game = new chess.Chess()
    board.position(game.fen())
    canPickUp = true;
    gameActive = false;
    moveCount = 1
    if (opponent.WorB) {
        window.setTimeout(proceedToComputer, LONG_TIMEOUT);
    }
    displayGameOver(false)
}

// Based on the slider
function changeTime(timeLimit) {
    if (opponent != null) {
        if (opponent.hasTimeLimit) {
            document.getElementById("Thinking").innerHTML = "Thinking Time: " + (Math.round(timeLimit*10)/10) + "s"
            opponent.setTimeLimit(timeLimit)
        }
    }
}

// Change board color
function swapColor() {
    if (gameActive) {
        if (moveCount == 2 && opponent.WorB || game.fen() == STARTING_FEN) {
            moveCount = 1
            game = new chess.Chess()
            board.position(game.fen())
            window.setTimeout(swapColorHelper, 500)
        }
        else {
            return 
        }
    }

    else {
        swapColorHelper()
    }
}

// Assuming game is active/valid
function swapColorHelper() {

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
        }
        
        gameActive = true
        board = Chessboard('myBoard', config)
        canPickUp = true;
    }
}

// Allow tree building whilst computer waiting for player
function activateTreeBuilding() {
    treeBuildingAllowed = true;
}

// Make physical board move
function updateBoard() {
    board.position(game.fen())
    boardReady = true;
}

// Make computer move on game and physical board
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
    nextMove = opponent.selectMove(game, moves, moveNumber = moveCount)

    moveCount++

    if (printMoves) {
        console.log(nextMove)
    }

    // Move in internal game
    game.move(nextMove)

    // Check for end of game
    if (game.isGameOver()) {
        displayGameOver(true)
    }

    // Move on front end board
    window.setTimeout(updateBoard, NO_TIMEOUT)

    // Allow offline tree building
    window.setTimeout(activateTreeBuilding, COVER_TIMEOUT);

    // Allow player pick up
    window.setTimeout(function(){canPickUp = true;}, 100);
}



window.onload = function() {            
    function test() {

        update()
    }
    setInterval(test, 0);
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

    else if (gameActive && opponent.offlineTreeBuilding && treeBuildingAllowed && offlineEnabled) {
        opponent.offlineImproveTree()
    }
}

var gameActive = false






// Used in testing, not necessary anymore
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