class Agent{
    constructor(id, WorB) {
        this.id = id;
        this.WorB = WorB
    }

    selectMove(board, moves) {
        return null
    }
}

class randomAgent extends Agent{
    constructor(id, WorB) {
        super(id, WorB)
    }

    selectMove(board, moves) {
        const move = moves[Math.floor(Math.random() * moves.length)]
        return move
    }
}

var agentTypesDict = {
    "random": randomAgent
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