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

// Gets piece value
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
var isEarlyGame = true;

var pieceTaken = false;
var myColor = 'w';

var valueScore = 0

var tilesList = []



let positionScore = 0

let testPiece = null;

exports.complexEval = function compEval(game, action, preEval, WorB, actions) {
    
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
const PASSED_PAWN_REWARD = 1
const CONNECTED_FLAT_REWARD = 1
const CONNECTED_STEP_REWARD = 1.1
const MAX_PAWN_STRUCTURE = 0

function earlyGameEval(game, action, preEval, WorB, actions) {

    if (WorB) { myTeamColor = 'w'; }
    else { myTeamColor = 'b'; }

    pawnStructure = 0
    positionScore = 0
    valueScore = 0

    // Looping through files
    for (let i = 0; i < letters.length; i++) {

        myPawnInRow = false
        opPawnInRow = false

        // Looping through rows
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

                    // Only for files a to g, excluding row 1 and 8
                    if (i < letters.length - 1 && j < 8 && j > 1) {

                        // If adjacent pawn of my color is mine
                        if (game.get(letters[i + 1] + j).type === 'p') {
                            
                            // If color matches
                            if (game.get(letters[i + 1] + j).color === testPiece.color) {

                                pawnStructure += multiplier * CONNECTED_FLAT_REWARD
                            }
                        }

                        // If forward stepped pawn of my color is mine
                        if (game.get(letters[i + 1] + (j+1)).type === 'p') {
                            
                            // If color matches
                            if (game.get(letters[i + 1] + (j+1)).color === testPiece.color) {

                                pawnStructure += multiplier * CONNECTED_STEP_REWARD
                            }
                        }

                        // If forward stepped pawn of my color is mine
                        if (game.get(letters[i + 1] + (j-1)).type === 'p') {
                            
                            // If color matches
                            if (game.get(letters[i + 1] + (j-1)).color === testPiece.color) {

                                pawnStructure += multiplier * CONNECTED_STEP_REWARD
                            }
                        }
                    }

                    // Requires check again (improve later)
                    if (testPiece.color === myTeamColor) {

                        if (myPawnInRow) {

                            // Doubled pawn
                            pawnStructure -= DOUBLED_PAWN_PENALTY
                        }

                        else {
                            myPawnInRow = true
                        }
                    }

                    // Opponent pawn
                    else {

                        if (opPawnInRow) {

                            // Doubled pawn
                            pawnStructure += DOUBLED_PAWN_PENALTY
                        }

                        else {
                            opPawnInRow = true
                        }
                    }
                }
            }
        }

        // Checking for passed pawns (no hanging pawn check yet)
        if (myPawnInRow) {

            // Passed pawn for me
            if (!opPawnInRow) {
                pawnStructure += PASSED_PAWN_REWARD;
            }
        }

        // Opponent has passed pawn
        else if (!opPawnInRow) {
            pawnStructure -= PASSED_PAWN_REWARD;
        }
    }

    console.log(pawnStructure)

    return (
        0.05 * ((positionScore - MIN_BOARD_POSITION) / (MAX_BOARD_POSITION - MIN_BOARD_POSITION)) + 
        0.95 * ((valueScore - MIN_BOARD) / (MAX_BOARD - MIN_BOARD))
    )
}

function lateGameEval(game, action, preEval, WorB, actions) {
    return 0
}