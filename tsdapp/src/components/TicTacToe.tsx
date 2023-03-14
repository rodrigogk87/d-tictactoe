import { Contract, ethers } from 'ethers';
import TicTacToeContract from '../artifacts/contracts/TicTacToe.sol/TicTacToe.json';
import { useEffect, useState, ReactElement } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useContract } from '../hooks/useContract';

export function TicTacToe(): ReactElement {

    const { contract } = useContract();

    const [gameId, setGameId] = useState<number>(3);
    const [gameStarted, setGameStarted] = useState<boolean>(false);
    const [players, setPlayers] = useState<string[]>([]);
    const [currentPlayer, setCurrentPlayer] = useState<string>('');
    const [board, setBoard] = useState<string[][]>([
        ['', '', ''],
        ['', '', ''],
        ['', '', ''],
    ]);
    const [winner, setWinner] = useState<string>('');
    const [tie, setTie] = useState<boolean>(false);
    const [prize, setPrize] = useState<string>('0');

    useEffect(() => {
        if (contract)
            getGameData(contract);
    }, [contract])

    const getGameData = async (contract: Contract) => {
        const gameInfo = await contract.getGameInfo(gameId);
        setPlayers(gameInfo.players);
        setGameStarted(gameInfo.isStarted);
        const gameBoard = gameInfo.board.map((row: (string | null)[]) =>
            row.map((cell: string | null) => (cell === null ? '' : cell))
        );
        setBoard(gameBoard);
        setPrize(ethers.utils.formatEther(gameInfo.prize));
        setCurrentPlayer(gameInfo.currentPlayer);
        console.log(gameBoard);
    }

    // create a new game
    const handleCreateGame = async (contract: Contract) => {
        let tx = await contract.createGame();
        await tx.wait();
        setGameId((prevId: number) => prevId + 1);
    };

    // join an existing game
    const handleJoinGame = async (contract: Contract) => {
        try {
            const value = ethers.utils.parseEther('5');
            let tx = await contract.joinGame(gameId, { value });
            await tx.wait();
            await getGameData(contract);
        } catch (error) {
            console.log(error);
        }
    };

    // start the game
    const handleStartGame = async (contract: Contract) => {
        try {
            let tx = await contract.startGame(gameId);
            await tx.wait();
            await getGameData(contract);
        } catch (error) {
            console.log(error);
        }
    };

    // make a move on the board
    const handleCellClick = async (contract: Contract, row: number, col: number) => {
        try {
            let tx = await contract.play(gameId, row, col);
            await tx.wait();
            await getGameData(contract);
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
                {contract &&
                    <>
                        <div className="game-info">
                            <h2>Game Information</h2>
                            <p>Game ID: {gameId}</p>
                            <p>Prize: {prize}</p>
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
                                    <button onClick={() => handleJoinGame(contract)}>Join Game</button>
                                </>
                            )}
                        </div>
                        <div className="board">
                            <Container fluid>
                                {board.map((row, rowIndex) => (
                                    <Row key={rowIndex}>
                                        {row.map((cell, colIndex) => (
                                            <Col xs={4}>
                                                <div
                                                    className={`board-cell`}
                                                    onClick={() => handleCellClick(contract, rowIndex, colIndex)}
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
                                    <button onClick={() => handleCreateGame(contract)}>Create Game</button>
                                </div>
                            )}
                        </div>
                        {!gameStarted && !winner && (
                            <div className="start-game">
                                <button onClick={() => handleStartGame(contract)}>Start Game</button>
                            </div>
                        )}
                    </>
                }
                {!contract && <h2> Loading... </h2>}
            </main>
            <footer>
                <p>Powered by Ethereum and Hardhat.</p>
            </footer>
        </div>
    );
}