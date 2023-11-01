# Planning Notes

## MVP Requirements

- allows 2 human players to place X and O pieces on a 3 x 3 grid / board
- updates the game board
  - when the game starts and no player has placed any piece yet
  - after a player places a piece
  - after the game is over
- update a display element that
  - shows which player's (by name and piece / marker) turn it currently is
  - shows a congrats message to the winner if either X or O won
  - shows a tie message if there was no winner at the end of the game
- has a button that allows for a human player to restart or start a new game at any point

## Bonus Requirements

- allow the human user to choose to play against another human player or a computer player
- if playing against a computer player, make the computer player unbeatable using a minimax algorithm

## Pseudocode

- start new game with default settings
  - X starts first
- game loop
  - if game is over (X won, O won, or tie i.e. full board)
    - update game state as over
    - display message of game result
    - prevent board from getting input / updated
    - exit loop
  - get the current player's turn
  - get cell or square position input from current player
    - if input is not valid,
      - do nothing or prompt input from current player again
  - place player's game piece (X or O) on board
  - update current turn to the other player

## Expanded Pseudocode Notes

- `Gameboard` module
  - fields
    - private `rows`: int set to 3
    - private `cols`: int set to 3
    - private `board`: 2D array of strings with `rows` rows and `cols` columns set to strings of all `.` chars
  - methods
    - `Gameboard()`:
      - TODO
    - private `didPieceWinHorizontally(piece)`
      - TODO
    - private `didPieceWinVertically(piece)`
      - TODO
    - private `didPieceWinPosDiagonally(piece)`
      - TODO
    - private `didPieceWinNegDiagonally(piece)`
      - TODO
    - public `didPieceWin(piece)`:
      - `piece`: a string value from the set { `X`, `O` }
      - returns true if there is 3 in an unbroken line horizontally, vertically, negative diagonally, or positive diagonally
      - else returns false
    - public `isTie()`:
      - returns true if board is full else false
    - public `resetBoard()`
    - public `canPlaceAt(piece, position)`
    - public `placeAt(piece, position)`

- `Game` module
  - fields
    - private `board`: instance of `Gameboard` module
    - private `players`: array of `Player` subclass objects
    - private `turnPiece`: string set to `X` or `O`
    - private `isPlaying`: boolean initially set to `false`
  - methods
    - `Game()`
      - TODO
    - public `resetGame()`
    - public `getTurnPiece()`
    - public `setTurnPiece()`
    - public `getPlayers()`
    - public `setPlayers()`
    - public `getIsPlaying()`
    - public `setIsPlaying()`

- `Player` factory (object constructor / class)
  - fields
    - private `piece`: string set to `X` or `O`
    - private `name`: string set to `Player`
  - methods
    - public `getName()`
    - public `setName()`
    - public `getPiece()`
    - public `setPiece()`

- `HumanPlayer` factory (object constructor / class)
  - inherits from `Player` factory

- `ComputerPlayer` factory (object constructor / class)
  - inherits from `Player` factory
  - methods
    - public `getRandomMove()`
    - public `getUnbeatableMove()`

- `DisplayController` module
  - fields
    - TODO
  - methods
    - public `renderBoard()`
    - public `renderStatus()`
    - public `renderGameForm()`
    - public `toggleGameForm()`
    - public `handleGameFormSubmit()`
