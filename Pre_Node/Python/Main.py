import GameRunner
import Python.Agents as Agents

x = 0

while x < 1:
    x += 1
    white_player = Agents.RandomAgent()
    black_player = Agents.PureMCTS()

    game = GameRunner.Game(white_player, black_player, 1000, False)
    game.play_game()
    #print(game.result)