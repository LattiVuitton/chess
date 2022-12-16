var nodeID = -1

function getID() {
    nodeID += 1
    return nodeID
}

class Node {
    constructor(id, board, parent, moves) {
        this.id = id;
        this.board = board;
        this.parent = parent;
        this.moves = moves;
        this.children = []
    }

    fullyExplored() {
        if (this.children.length === this.moves.length) return true
        return false
    }

    // Multi - arm bandit
    getNext() {
        
    }

}

exports.getNewNode = function getNode(board, parent, moves) {

    var node = new Node(getID(), board, parent, moves)
    return node
}