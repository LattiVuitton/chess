# Chess
Play against the bot: https://lattivuitton.github.io/chess/

This is a full-stack web dev project for users to play against an AI chess opponent. The front-end is created using chessboard.js, and the back-end is largely coded in javascript/typescript, using the chess.js package for board generation. At current, the algorithm for move selection uses Monte Carlo tree search, and a simple piece value/position value evaluation function. Given the inefficiencies of the chess.js package for board/move generation, the playing quality of the AI is relatively low, (~1000 ELO), with especially weak early game play. 

Full details on implementation, inspiration, and future directions will be outlined in the wiki: https://github.com/LattiVuitton/chess/wiki
