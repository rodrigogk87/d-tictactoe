pragma solidity ^0.8.0;

contract TicTacToe {
    struct Game {
        address[] players;
        address currentPlayer;
        mapping(uint => mapping(uint => address)) board;
        bool isStarted;
        address winner;
        bool tie;
    }

    mapping(uint => Game) public games;
    uint public gameCount;

    constructor() {
        gameCount = 0;
    }

    function getGameInfo(
        uint _gameId
    )
        public
        view
        returns (
            address[] memory players,
            address currentPlayer,
            address[][] memory board,
            bool isStarted,
            address winner,
            bool tie
        )
    {
        Game storage game = games[_gameId];
        players = game.players;
        currentPlayer = game.currentPlayer;

        // Convert the nested mapping to an array of arrays
        board = new address[][](3);
        for (uint i = 0; i < 3; i++) {
            board[i] = new address[](3);
            for (uint j = 0; j < 3; j++) {
                board[i][j] = game.board[i][j];
            }
        }

        isStarted = game.isStarted;
        winner = game.winner;
        tie = game.tie;
    }

    function createGame() public {
        gameCount++;
    }

    function joinGame(uint _gameId) public {
        require(games[_gameId].players.length < 2, "Game is already full.");
        require(games[_gameId].isStarted == false, "Game has already started.");
        games[_gameId].players.push(msg.sender);
    }

    function startGame(uint _gameId) public {
        require(
            games[_gameId].players.length == 2,
            "Need 2 players to start the game."
        );
        require(games[_gameId].isStarted == false, "Game has already started.");
        games[_gameId].isStarted = true;
        games[_gameId].currentPlayer = games[_gameId].players[0];
    }

    function play(uint _gameId, uint _row, uint _col) public {
        Game storage game = games[_gameId];
        require(game.isStarted == true, "Game has not started yet.");
        require(
            game.board[_row][_col] == address(0),
            "Cell is already occupied."
        );
        require(msg.sender == game.currentPlayer, "Not your turn.");
        game.board[_row][_col] = msg.sender;
        if (checkWin(game.board, msg.sender)) {
            // winner
            games[_gameId].isStarted = false;
            games[_gameId].winner = msg.sender;
        } else if (checkDraw(game.board)) {
            games[_gameId].isStarted = false;
            games[_gameId].tie = true;
        } else {
            game.currentPlayer = getNextPlayer(game.players, msg.sender);
        }
    }

    function getNextPlayer(
        address[] memory _players,
        address _currentPlayer
    ) private pure returns (address) {
        for (uint i = 0; i < _players.length; i++) {
            if (_players[i] == _currentPlayer) {
                if (i == _players.length - 1) {
                    return _players[0];
                } else {
                    return _players[i + 1];
                }
            }
        }
        revert("Player not found.");
    }

    function checkWin(
        mapping(uint => mapping(uint => address)) storage _board,
        address _player
    ) private view returns (bool) {
        // check rows
        for (uint i = 0; i < 3; i++) {
            if (
                _board[i][0] == _player &&
                _board[i][1] == _player &&
                _board[i][2] == _player
            ) {
                return true;
            }
        }
        // check columns
        for (uint j = 0; j < 3; j++) {
            if (
                _board[0][j] == _player &&
                _board[1][j] == _player &&
                _board[2][j] == _player
            ) {
                return true;
            }
        }
        // check diagonals
        if (
            _board[0][0] == _player &&
            _board[1][1] == _player &&
            _board[2][2] == _player
        ) {
            return true;
        }

        if (
            _board[0][2] == _player &&
            _board[1][1] == _player &&
            _board[2][0] == _player
        ) {
            return true;
        }
        return false;
    }

    function checkDraw(
        mapping(uint => mapping(uint => address)) storage _board
    ) private view returns (bool) {
        for (uint i = 0; i < 3; i++) {
            for (uint j = 0; j < 3; j++) {
                if (_board[i][j] == address(0)) {
                    return false;
                }
            }
        }
        return true;
    }
}
