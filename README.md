## Chess AI
# Introduction

This project is a web application that allows users to play chess against an AI opponent. It is designed as a front end web project using a variety of technologies, including chessboard.js js/typescript with the chess.js package for board generation.

# Getting Started

To play against the bot, simply visit the following link: https://lattivuitton.github.io/chess/

# Implementation Details

The front-end of the application was created using the chessboard.js library, which provides an interface for interacting with a chess board. The back-end of the application is largely coded in javascript/typescript, using the chess.js package for board generation. The algorithm for move selection is implemented using Monte Carlo tree search and a simple piece value/position value evaluation function.

The use of the chess.js package for board/move generation has led to relatively low playing quality of the AI, with an estimated ELO of around 1000, with particularly weak early game play. However, the project is still a work in progress, and future improvements to the algorithm and evaluation function may be implemented to improve the playing strength.

Inspiration

The inspiration for this project came from a desire to create a simple, user-friendly web application that allows users to play chess against an AI opponent. The use of the chessboard.js library and the chess.js package for board generation provided a solid foundation for the project, and the implementation of Monte Carlo tree search for move selection allowed for an effective and efficient AI opponent.

Future Directions

The project is still a work in progress, and there are several potential areas for future development. One possible avenue of improvement would be to implement more advanced board evaluation strategy, especially through neural nets. Additionally, improvements to the evaluation function could be implemented to improve the playing strength of the AI. Finally, the user interface could be further improved to make the application more user-friendly and visually appealing. These and other potential areas for future development are outlined in more detail in the project's wiki: https://github.com/LattiVuitton/chess/wiki.
