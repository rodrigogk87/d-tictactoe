import { ethers } from 'ethers';
import TicTacToe from './artifacts/contracts/TicTacToe.sol/TicTacToe.json';
import { useEffect, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';

function App() {
  const [gameId, setGameId] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [players, setPlayers] = useState([]);
  const [currentPlayer, setCurrentPlayer] = useState('');
  const [board, setBoard] = useState([
    ['', '', ''],
    ['', '', ''],
    ['', '', ''],
  ]);
  const [winner, setWinner] = useState('');
  const [tie, setTie] = useState(false);

  useEffect(() => {
    const init = async () => {
      const contract = await connectToContract();
      const gameInfo = await contract.getGameInfo(gameId);
      setPlayers(gameInfo.players);
      setCurrentPlayer(gameInfo.currentPlayer);
      setGameStarted(gameInfo.isStarted);
      const gameBoard = gameInfo.board.map((row) =>
        row.map((cell) => (cell === null ? '' : cell))
      );
      setBoard(gameBoard);

      console.log(gameBoard);
    }
    init();
  }, [gameId, currentPlayer])

  // connect to the contract
  const connectToContract = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        "0x5FbDB2315678afecb367f032d93F642f64180aa3",
        TicTacToe.abi,
        signer
      );
      return contract;
    } catch (error) {
      console.log(error);
    }
  };

  // create a new game
  const handleCreateGame = async () => {
    const contract = await connectToContract();
    await contract.createGame();
    setGameId((prevId) => prevId + 1);
  };

  // join an existing game
  const handleJoinGame = async () => {
    const contract = await connectToContract();
    try {
      await contract.joinGame(gameId);
      const gameInfo = await contract.getGameInfo(gameId);
      setPlayers(gameInfo.players);
      setCurrentPlayer(gameInfo.currentPlayer);
      setGameStarted(gameInfo.isStarted);
      const gameBoard = gameInfo.board.map((row) =>
        row.map((cell) => (cell === null ? '' : cell))
      );
      setBoard(gameBoard);
    } catch (error) {
      console.log(error);
    }
  };

  // start the game
  const handleStartGame = async () => {
    const contract = await connectToContract();
    try {
      await contract.startGame(gameId);
      const gameInfo = await contract.getGameInfo(gameId);
      setCurrentPlayer(gameInfo.currentPlayer);
      setGameStarted(gameInfo.isStarted);
    } catch (error) {
      console.log(error);
    }
  };

  // make a move on the board
  const handleCellClick = async (row, col) => {
    const contract = await connectToContract();
    try {
      await contract.play(gameId, row, col);
      const gameInfo = await contract.getGameInfo(gameId);
      setPlayers(gameInfo.players);
      setCurrentPlayer(gameInfo.currentPlayer);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Tic Tac Toe Dapp</h1>
      </header>
      <main>
        <div className="game-info">
          <h2>Game Information</h2>
          <p>Game ID: {gameId}</p>
          {gameStarted ? (
            <>
              <p>Players: {players.join(', ')}</p>
              <p>Current Player: {currentPlayer}</p>
              {tie || winner ? (
                <p>{tie ? "It's a tie!" : `Winner: ${winner}`}</p>
              ) : (
                <p>Make your move, {currentPlayer}!</p>
              )}
            </>
          ) : (
            <>
              <p>Waiting for playerx...</p>
              <button onClick={handleJoinGame}>Join Game</button>
            </>
          )}
        </div>
        <div className="board">
          <Container fluid>
            {board.map((row, rowIndex) => (
              <Row key={rowIndex}>
                {row.map((cell, colIndex) => (
                  <Col xs={4} key={colIndex}>
                    <div
                      className={`board-cell ${cell}`}
                      onClick={() => handleCellClick(rowIndex, colIndex)}
                    >
                      {cell === players[0] ? 'X' : cell === players[1] ? 'O' : '_'}
                    </div>
                  </Col>
                ))}
              </Row>
            ))}
          </Container>


          {!gameStarted && (
            <div className="create-game">
              <button onClick={handleCreateGame}>Create Game</button>
            </div>
          )}
        </div>
        {!gameStarted && !winner && (
          <div className="start-game">
            <button onClick={handleStartGame}>Start Game</button>
          </div>
        )}
      </main>
      <footer>
        <p>Powered by Ethereum and Hardhat.</p>
      </footer>
    </div>
  );

}

export default App;