var agents = require('./Agents');

const agent1 = agents.getAgent("alwaysTake", 1, true);
const agent2 = agents.getAgent("random", 2, false);

agent1Wins = 0
agent2Wins = 0
draws = 0

const roundsToPlay = 100

console.log("")

for (let i = 0; i < roundsToPlay; i++){

    var game = require('./GameRunner');
    
    const winner = game.runGame(agent1, agent2, false);

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




