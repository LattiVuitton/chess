import chess

class Game:
    def __init__(self, white, black, max, display):
        self.white_player = white
        self.black_player = black
        self.max_moves = max
        self.display_on = display
        self.result = -1
        self.move = 1

    def create_game(self):
        # create board object
        self.board=chess.Board()

    # Returns results of the game
    def results(self, victor, message=""):
        # 0 = Draw
        # 1 = White Win
        # 2 = Black Win
        self.result = (victor, message)

    def play_game(self):
        # Setting up
        self.create_game()
        # print("Board Created!")
        # print("Playing Game!")

        self.move = 1
        while self.move < self.max_moves:

            # White move
            white_move = self.white_player.move(list(self.board.legal_moves),self.board)
            self.board.push(white_move)

            # Check game status
            self.move += 1
            if self.display_on:
                print()
                print("White playing, turn", self.move)
                print(self.board)
            if self.board.is_checkmate():
                print("White wins")
                break
            elif self.board.is_stalemate():
                print("Stalemate")
                break
            elif self.board.is_insufficient_material():
                print("Insufficient Material Draw")
                break
            elif self.board.is_fivefold_repetition():
                print("Fivefold Repetition")
                break

            # Black move
            black_move = self.black_player.move(list(self.board.legal_moves),self.board)
            self.board.push(black_move)

            # Check game status
            self.move += 1
            if self.display_on:
                print()
                print("Black playing, turn", self.move)
                print(self.board)
            if self.board.is_checkmate():
                print("Black wins")
                break
            elif self.board.is_stalemate():
                print("Stalemate")
                break
            elif self.board.is_insufficient_material():
                print("Insufficient Material Draw")
                break
            elif self.board.is_fivefold_repetition():
                print("Fivefold Repetition")
                break
        #print(self.board, "\n")
        #print("Moves taken:", self.move)
