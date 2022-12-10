const chess = require('chess.js')

var game = new chess.Chess()

exports.runGame = function run(agent1, agent2, printGame) {

    game.reset()

    var round = 0

    while (true) {

        if (printGame) {
            console.log(game.fen())
        }
    
        if (game.isGameOver()) {
            if (game.isCheck()) {
                return agent2
            }
            return null
        }

        var moves1 = null

        if (agent1.requiresVerbose) {
            moves1 = game.moves({ verbose: true })
        }

        else {
            moves1 = game.moves()
        }
        const move1 = agent1.selectMove(game, moves1)
        game.move(move1)
        
        round++

        if (printGame) {
            console.log(game.fen())
        }

        if (game.isGameOver()) {
            if (game.isCheck()) {
                return agent1
            }
            return null
        }

        var moves2 = null

        if (agent2.requiresVerbose) {
            moves2 = game.moves({ verbose: true })
        }

        else {
            moves2 = game.moves()
        }
        const move2 = agent2.selectMove(game, moves2)
        game.move(move2)
        
        round++
    }

    console.log('game length: ' + round)
    const moves = game.moves()

    console.log(agent1.selectMove("boardPlaceholder", moves))
}