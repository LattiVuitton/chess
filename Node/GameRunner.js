const chess = require('chess.js')

var game = new chess.Chess()

exports.runGame = function run(agent1, agent2) {

    game.reset()

    var round = 0

    while (true) {
    
        if (game.isGameOver()) {
            if (game.isCheck()) {
                return agent1
            }
            return null
        }

        const moves1 = game.moves()
        const move1 = agent1.selectMove(game, moves1)
        game.move(move1)
        
        round++

        if (game.isGameOver()) {
            if (game.isCheck()) {
                return agent2
            }
            return null
        }

        const moves2 = game.moves()
        const move2 = agent2.selectMove(game, moves2)
        game.move(move2)
        
        round++
    }

    console.log('game length: ' + round)
    const moves = game.moves()

    console.log(agent1.selectMove("boardPlaceholder", moves))
}