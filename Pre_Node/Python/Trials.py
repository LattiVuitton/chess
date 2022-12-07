# import required module
import random
import chess
 
# create board object
board=chess.Board()

i=0
while i < 500:
    i+=1
    # display chess board
    print("\nBoard: " + str(i)+ "\n")
    print(board)

    print("Legal Moves", list(board.legal_moves))
    move = input("Move:")
    if move in list(board.legal_moves) or 1==1:
        board.push_san(move)
    else:
        print("Fatal error")
        break

    move = random.choice(list(board.legal_moves))

    board.push(move)

# if board.is_stalemate():
#     print("STALE")
# if board.is_checkmate():
#     print("CHECKMATE")