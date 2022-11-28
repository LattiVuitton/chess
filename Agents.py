import copy
import random
import chess
import NeuralNetworks
import time

# My Abstract Class
class Agent:
    def __init__(self) -> None:
        pass

    def generate_next_board(self, board, move):
        new_board = copy.deepcopy(board)
        new_board.push(move)
        return new_board

    def move(self, actions, board):
        return random.choice(actions)

class RandomAgent(Agent):
    def __init__(self) -> None:
        super().__init__()

    def move(self, actions, board):
        return super().move(actions, board)

class AlwaysCapture(Agent):
    def __init__(self) -> None:
        super().__init__()

    def move(self, actions, board):
        legal_captures = list(board.generate_legal_captures())
        if len(legal_captures) > 0:
            return random.choice(legal_captures)

        # Checkmate if possible
        for move in actions:
            next_board = self.generate_next_board(board,move)
            if next_board.is_checkmate():
                return move
        
        # Play random capture if possible
        for move in actions:
            if board.gives_check(move):
                return move
        return super().move(actions, board)

class HumanAgent(Agent):
    def __init__(self) -> None:
        super().__init__()
    
    def move(self, actions, board):
        input_given = False
        while not input_given:
            message = "Available Actions:"
            for action in actions:
                message += (" " + action.__str__())
            print(message)
            move = input("\nMove:")
            for action in actions:
                if move == action.__str__():
                    return action

            else:
                print("Move invalid!")

class NeuralNetOnly(Agent):
    def __init__(self) -> None:
        self.neural_net = NeuralNetworks.MLP()
        super().__init__()
    
    def move(self, actions, board):
        best_q = 0
        best_action = actions[0]
        for move in actions:
            next_board = self.generate_next_board(board,move)
            q = self.neural_net.evaluate(next_board)
            if q > best_q:
                best_action = move
                best_q = q
        return best_action

class PureMCTS(Agent):

    class Node:
        def __init__(self):
            self.children = []
            self.wins = 0
            self.visits = 0
        
        def MultiArmBandit(self, actions):
            return random.choice(actions)

    def __init__(self) -> None:
        self.time_limit = 1
        super().__init__()
    
    def move(self, actions, board):
        
        return super().move(actions, board)