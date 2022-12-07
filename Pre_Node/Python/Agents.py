import copy
import random
import chess
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
        import NeuralNetworks
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
        def __init__(self, board, id):
            self.children = []
            self.wins = 0
            self.visits = 0
            self.board = board
            self.id = id
        
        def MultiArmBandit(self, actions):
            return random.choice(actions)

    def __init__(self):
        self.time_limit = 1
        self.move_number = 0
        self.next_node_id = 0
        super().__init__()

    def get_id(self):
        self.next_node_id += 1
        return self.next_node_id
    
    def move(self, actions, board):

        self.move_number += 1

        end = time.time() + self.time_limit

        count = 1

        if self.move_number == 1:
            root_node = self.Node(board, self.get_id())
        else:
            root_node = self.Node(board, self.get_id())

        while time.time() < end:
            count += 1

            # Simulation
            simulation_node = root_node

            simulation_board = simulation_node.board
            my_move = random.choice(list(actions))

            count2 = 0

            game_result = 0.5

            while count2 < 1000:
                count2 += 1

                opposition_board = self.generate_next_board(simulation_board, my_move)

                if opposition_board.is_checkmate():
                    game_result = 1
                    break
                elif opposition_board.is_stalemate():
                    break
                elif opposition_board.is_insufficient_material():
                    break
                elif opposition_board.is_fivefold_repetition():
                    break

                opposition_available_actions = opposition_board.legal_moves
                opposition_move = random.choice(list(opposition_available_actions))

                simulation_board = self.generate_next_board(opposition_board, opposition_move)

                if simulation_board.is_checkmate():
                    game_result = 0
                    break
                elif simulation_board.is_stalemate():
                    break
                elif simulation_board.is_insufficient_material():
                    break
                elif simulation_board.is_fivefold_repetition():
                    break

                available_actions = simulation_board.legal_moves
                my_move = random.choice(list(available_actions))
            
            print("Simulation depth:", count2, "Result", game_result)

        print("\nMove:", self.move_number, "Simulated Nodes:", count, "\n")

        return super().move(actions, board)