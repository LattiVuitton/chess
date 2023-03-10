// Piece tables

let whitePawns = [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [50, 50, 50, 50, 50, 50, 50, 50],
    [10, 10, 20, 30, 30, 20, 10, 10],
    [5, 5, 10, 25, 25, 10, 5, 5],
    [0, 0, 0, 20, 20, 0, 0, 0],
    [5, -5, -10, 0, 0, -10, -5, 5],
    [5, 10, 10, -20, -20, 10, 10, 5],
    [0, 0, 0, 0, 0, 0, 0, 0]
]
let blackPawns = [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [5, 10, 10, -20, -20, 10, 10, 5],
    [5, -5, -10, 0, 0, -10, -5, 5],
    [0, 0, 0, 20, 20, 0, 0, 0],
    [5, 5, 10, 25, 25, 10, 5, 5],
    [10, 10, 20, 30, 30, 20, 10, 10],
    [50, 50, 50, 50, 50, 50, 50, 50],
    [0, 0, 0, 0, 0, 0, 0, 0]
]
let whiteKnights = [
    [-50, -40, -30, -30, -30, -30, -40, -50],
    [-40, -20, 0, 0, 0, 0, -20, -40],
    [-30, 0, 10, 15, 15, 10, 0, -30],
    [-30, 5, 15, 20, 20, 15, 5, -30],
    [-30, 0, 15, 20, 20, 15, 0, -30],
    [-30, 5, 10, 15, 15, 10, 5, -30],
    [-40, -20, 0, 5, 5, 0, -20, -40],
    [-50,-40,-30,-30,-30,-30,-40,-50]
]
let blackKnights = [
    [-50, -40, -30, -30, -30, -30, -40, -50],
    [-40, -20, 0, 5, 5, 0, -20, -40],
    [-30, 5, 10, 15, 15, 10, 5, -30],
    [-30, 0, 15, 20, 20, 15, 0, -30],
    [-30, 5, 15, 20, 20, 15, 5, -30],
    [-30, 0, 10, 15, 15, 10, 0, -30],
    [-40, -20, 0, 0, 0, 0, -20, -40],
    [-50,-40,-30,-30,-30,-30,-40,-50]
]
let whiteBishops = [
    [-20, -10, -10, -10, -10, -10, -10, -20],
    [-10, 0, 0, 0, 0, 0, 0, -10],
    [-10, 0, 5, 10, 10, 5, 0, -10],
    [-10, 5, 5, 10, 10, 5, 5, -10],
    [-10, 0, 10, 10, 10, 10, 0, -10],
    [-10, 10, 10, 10, 10, 10, 10, -10],
    [-10, 5, 0, 0, 0, 0, 5, -10],
    [-20,-10,-10,-10,-10,-10,-10,-20]
]
let blackBishops = [
    [-20, -10, -10, -10, -10, -10, -10, -20],
    [-10, 5, 0, 0, 0, 0, 5, -10],
    [-10, 10, 10, 10, 10, 10, 10, -10],
    [-10, 0, 10, 10, 10, 10, 0, -10],
    [-10, 5, 5, 10, 10, 5, 5, -10],
    [-10, 0, 5, 10, 10, 5, 0, -10],
    [-10, 0, 0, 0, 0, 0, 0, -10],
    [-20, -10, -10, -10, -10, -10, -10, -20]
]
let whiteRooks = [
    [0,  0,  0,  0,  0,  0,  0,  0],
    [5, 10, 10, 10, 10, 10, 10,  5],
    [-5,  0,  0,  0,  0,  0,  0, -5],
    [-5,  0,  0,  0,  0,  0,  0, -5],
    [-5,  0,  0,  0,  0,  0,  0, -5],
    [-5,  0,  0,  0,  0,  0,  0, -5],
    [-5,  0,  0,  0,  0,  0,  0, -5],
    [0,  0,  0,  5,  5,  0,  0,  0]
]
let blackRooks = [
    [0, 0, 0, 5, 5, 0, 0, 0],
    [-5,  0,  0,  0,  0,  0,  0, -5],
    [-5,  0,  0,  0,  0,  0,  0, -5],
    [-5,  0,  0,  0,  0,  0,  0, -5],
    [-5,  0,  0,  0,  0,  0,  0, -5],
    [-5,  0,  0,  0,  0,  0,  0, -5],
    [5, 10, 10, 10, 10, 10, 10,  5],
    [0,  0,  0,  0,  0,  0,  0,  0]
]
let whiteQueen = [
    [-20,-10,-10, -5, -5,-10,-10,-20],
    [-10,  0,  0,  0,  0,  0,  0,-10],
    [-10,  0,  5,  5,  5,  5,  0,-10],
    [-5,  0,  5,  5,  5,  5,  0, -5],
    [0,  0,  5,  5,  5,  5,  0, -5],
    [-10,  5,  5,  5,  5,  5,  0,-10],
    [-10,  0,  5,  0,  0,  0,  0,-10],
    [-20,-10,-10, -5, -5,-10,-10,-20]
]
let blackQueen = [
    [-20, -10, -10, -5, -5, -10, -10, -20],
    [-10,  0,  5,  0,  0,  0,  0,-10],
    [-10,  5,  5,  5,  5,  5,  0,-10],
    [0,  0,  5,  5,  5,  5,  0, -5],
    [-5,  0,  5,  5,  5,  5,  0, -5],
    [-10,  0,  5,  5,  5,  5,  0,-10],
    [-10,  0,  0,  0,  0,  0,  0,-10],
    [-20,-10,-10, -5, -5,-10,-10,-20]
]
let whiteKingEarly = [
    [-30,-40,-40,-50,-50,-40,-40,-30],
    [-30,-40,-40,-50,-50,-40,-40,-30],
    [-30,-40,-40,-50,-50,-40,-40,-30],
    [-30,-40,-40,-50,-50,-40,-40,-30],
    [-20,-30,-30,-40,-40,-30,-30,-20],
    [-10,-20,-20,-20,-20,-20,-20,-10],
    [20, 20,  0,  0,  0,  0, 20, 20],
    [20, 30, 10,  0,  0, 10, 30, 20]
]
let blackKingEarly = [
    [20, 30, 10, 0, 0, 10, 30, 20],
    [20, 20,  0,  0,  0,  0, 20, 20],
    [-10,-20,-20,-20,-20,-20,-20,-10],
    [-20,-30,-30,-40,-40,-30,-30,-20],
    [-30,-40,-40,-50,-50,-40,-40,-30],
    [-30,-40,-40,-50,-50,-40,-40,-30],
    [-30,-40,-40,-50,-50,-40,-40,-30],
    [-30,-40,-40,-50,-50,-40,-40,-30]
]
let whiteKingEnd = [
    [-50,-40,-30,-20,-20,-30,-40,-50],
    [-30,-20,-10,  0,  0,-10,-20,-30],
    [-30,-10, 20, 30, 30, 20,-10,-30],
    [-30,-10, 30, 40, 40, 30,-10,-30],
    [-30,-10, 30, 40, 40, 30,-10,-30],
    [-30,-10, 20, 30, 30, 20,-10,-30],
    [-30,-30,  0,  0,  0,  0,-30,-30],
    [-50,-30,-30,-30,-30,-30,-30,-50]
]
let blackKingEnd = [
    [-50,-30,-30,-30,-30,-30,-30,-50],
    [-50,-30,-30,-30,-30,-30,-30,-50]
    [-30,-10, 20, 30, 30, 20,-10,-30],
    [-30,-10, 30, 40, 40, 30,-10,-30],
    [-30,-10, 30, 40, 40, 30,-10,-30],
    [-30,-10, 20, 30, 30, 20,-10,-30],
    [-30,-20,-10,  0,  0,-10,-20,-30],
    [-50,-40,-30,-20,-20,-30,-40,-50]
]
let whitePieces = {
    'p': whitePawns,
    'n': whiteKnights,
    'b': whiteBishops,
    'r': whiteRooks,
    'q': whiteQueen,
}
let blackPieces = {
    'p': blackPawns,
    'n': blackKnights,
    'b': blackBishops,
    'r': blackRooks,
    'q': blackQueen,
}
let earlyKings = {
    'w': whiteKingEarly,
    'b': blackKingEarly
}
let endKings = {
    'w': whiteKingEnd,
    'b': blackKingEnd
}
let piecesDict = {
    'w': whitePieces,
    'b': blackPieces
}

let lettersToNumbers = {
    'a': 0,
    'b': 1,
    'c': 2,
    'd': 3,
    'e': 4,
    'f': 5,
    'g': 6,
    'h': 7
}

// Takes number between 1 and 8, and returns inverse between 0 and 7
function swapNumber(rowNumber) {
    return 8 - rowNumber
}

function getPieceValue(letter, number, type, color, endGame) {
    if (type === 'k') {

        if (endGame) {
            return endKings[color][swapNumber(number)][lettersToNumbers[letter]]
        }

        return earlyKings[color][swapNumber(number)][lettersToNumbers[letter]]
    }

    else {
        try {
            return piecesDict[color][type][swapNumber(number)][lettersToNumbers[letter]]
        }

        catch {
            console.log("Error finding tile")
            return null;
        }
    }
}

// Max and min possible board position
const MAX_BOARD_POSITION = 905;
const MIN_BOARD_POSITION = -905;

const MAX_BOARD = 41.52
const MIN_BOARD = -41.52

const letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
const pieceValues = {
    'p': 1,
    'n': 3.05,
    'b': 3.33,
    'r': 5.63,
    'q': 9.5,
    'k': 100
}

var boardsEvaluated = 0;

var isEarlyGame = true;

exports.evaluateBoard = function evaluate(game) {

    // Evaluation
    return -2
}

var highest = 0
function artificialCost(cost) {
    // Artificial Cost
    var count = 0
    for (let i = 0; i < cost; i++){
        denominator = Math.random()
        count += (denominator - 0.5)
    }
    
    if (1 / count > 100000) {
        console.log("A miracle: " + (1/count))
    }

}

exports.pieceValue = function countPieces(game, nodeColor, action, preEval) {

    var pieceTaken = false;

    if (action != null) {
        stringSan = action.san.split("")
        for (let i = 0; i < stringSan.length; i++){
            if (stringSan[i] === 'x') {
                pieceTaken = true;
            }
        }
    }

    if (!pieceTaken && preEval >= 0 && preEval <= 1) {
        return preEval
    }
    
    var myScore = 0
    var oppScore = 0

    // myColor = 'b'
    // if (nodeColor === 'b') {
    //     myColor = 'w'
    // }
    var myColor = nodeColor

    var tilesList = []
    for (let i = 0; i < letters.length; i++){
        for (let j = 1; j < letters.length + 1; j++){
            // artificialCost(1000)
            tile = letters[i] + j
            tilesList.push(tile)
            piece = game.get(tile)
            if (piece != false) {
                if (piece.color === myColor) {
                    myScore += pieceValues[piece.type]
                }
                else {
                    oppScore += pieceValues[piece.type]
                }
            }
        }
    }
    // console.log(nodeColor + ": " + (myScore + Number.EPSILON) / (myScore + oppScore + Number.EPSILON))
    console.log("ME: " + myScore + " them: " + oppScore)
    return (myScore + Number.EPSILON) / (myScore + oppScore + Number.EPSILON)
}

exports.getCount = function () {
    return boardsEvaluated
}

var pieceTaken = false;
var myColor = 'w';

var valueScore = 0

var tilesList = []

// Used for light nodes
exports.getQValue = function evaluateBoard(game, action, preEval, WorB) {

    boardsEvaluated++

    pieceTaken = false;

    if (WorB) {
        myColor = 'w';
    }

    else {
        myColor = 'b';
    }

    if (action != null) {
        stringSan = action.split("")
        for (let i = 1; i < stringSan.length; i++){
            if (stringSan[i] === 'x') {
                pieceTaken = true;
                break;
            }
        }
    }

    if (!pieceTaken && preEval >= 0 && preEval <= 1) {
        return 1 - preEval
    } 
    
    myScore = 0
    opScore = 0

    tilesList = []
    for (let i = 0; i < letters.length; i++){
        for (let j = 1; j < letters.length + 1; j++){
            // artificialCost(1000)
            tile = letters[i] + j
            tilesList.push(tile)
            piece = game.get(tile)
            if (piece != false) {
                if (piece.color === myColor) {
                    myScore += pieceValues[piece.type]
                }
                else {
                    opScore += pieceValues[piece.type]
                }
            }
        }
    }
    // console.log(nodeColor + ": " + (myScore + Number.EPSILON) / (myScore + oppScore + Number.EPSILON))
    // console.log("ME: " + whiteScore + " them: " + blackScore)
    // return (myScore / (myScore + oppScore))
    return (myScore + Number.EPSILON) / (myScore + opScore + Number.EPSILON)
}

exports.NN = function NeuralNet(game, action, preEval, WorB) {
    return Math.random();
}

let positionScore = 0

let testPiece = null;

exports.complexEval = function compEval(game, action, preEval, WorB, actions) {
    
    // Add:

    // Pawns:
    // Passed pawn (?)
    // Doubled pawns
    // Isolated vs Connected
    // Backward

    // Mobility
    // King safety


    if (isEarlyGame) {
        return earlyGameEval(game, action, preEval, WorB, actions)
    }

    else {
        return lateGameEval(game, action, preEval, WorB, actions)
    }
}

let pawnStructure = 0
let myPawnInRow = false
let opPawnInRow = false
let multiplier = 1

const DOUBLED_PAWN_PENALTY = 1

function earlyGameEval(game, action, preEval, WorB, actions) {

    if (WorB) { myTeamColor = 'w'; }
    else { myTeamColor = 'b'; }

    pawnStructure = 0
    positionScore = 0
    valueScore = 0

    // If required
    for (let i = 0; i < letters.length; i++) {

        myPawnInRow = false
        opPawnInRow = false

        for (let j = 1; j < letters.length + 1; j++) {
            testPiece = game.get(letters[i] + j)
            if (testPiece != false) {

                // Set multiplier depending on team
                if (testPiece.color === myTeamColor) { multiplier = 1 }
                else { multiplier = -1 }

                // Score additions
                positionScore += multiplier * getPieceValue(letters[i], j, testPiece.type, testPiece.color)
                valueScore += multiplier * pieceValues[testPiece.type]

                // Pawn structure work
                if (testPiece.type === 'p') {

                    // Requires check again (improve later)
                    if (testPiece.color === myTeamColor) {

                        if (myPawnInRow) {

                            // Doubled pawn
                            pawnStructure += DOUBLED_PAWN_PENALTY
                        }

                        else {
                            myPawnInRow = true
                        }
                    }

                    // Opponent pawn
                    else {

                        if (opPawnInRow) {

                            // Doubled pawn
                            pawnStructure -= DOUBLED_PAWN_PENALTY
                        }

                        else {
                            opPawnInRow = true
                        }
                    }
                }
            }
        }
    }

    return (
        0.05 * ((positionScore - MIN_BOARD_POSITION) / (MAX_BOARD_POSITION - MIN_BOARD_POSITION)) + 
        0.95 * ((valueScore - MIN_BOARD) / (MAX_BOARD - MIN_BOARD))
    )
}

function lateGameEval(game, action, preEval, WorB, actions) {
    return 0
}