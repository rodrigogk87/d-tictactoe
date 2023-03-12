# TICTACTOE

This is a smart contract for a Tic Tac Toe game on the Ethereum blockchain. The contract allows players to create and join games, and play against each other on a 3x3 grid.

The game is managed using a struct called Game, which stores the players, the current player, the board layout, whether the game has started, the winner and whether there is a tie.

The main functions in the contract are:

createGame(): Allows a player to create a new game, which generates a unique game ID.
joinGame(uint _gameId): Allows a player to join an existing game by providing the game ID.
startGame(uint _gameId): Starts the game with the provided game ID, but only if there are two players and the game has not already started.
play(uint _gameId, uint _row, uint _col): Allows the current player to play their turn by marking the specified row and column on the board with their address. This function also checks if the move is valid and if there is a winner or a tie.
The contract also includes several helper functions to manage the game logic, such as getNextPlayer() to switch turns, checkWin() to determine if a player has won, and checkDraw() to determine if there is a tie.

Finally, the getGameInfo() function allows anyone to retrieve information about a game by providing the game ID, including the players, the current player, the board layout, whether the game has started, the winner and whether there is a tie.