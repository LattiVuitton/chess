var nodeID = -1

function getID() {
    nodeID += 1
    return nodeID
}

class Node {
    constructor(id, board, parent) {
        
    }
}

exports.getNewNode = function getNode(board, parent) {

    var node = new Node(getID(), board, parent)
    return node
}