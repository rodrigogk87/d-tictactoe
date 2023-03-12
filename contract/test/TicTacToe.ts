import { ethers } from "hardhat";
import { expect } from "chai";

describe("TicTacToe", function () {
    let TicTacToe: any;
    let ticTacToe: any;
    let owner: any;
    let player1: any;
    let player2: any;

    beforeEach(async function () {
        TicTacToe = await ethers.getContractFactory("TicTacToe");
        [owner, player1, player2] = await ethers.getSigners();

        ticTacToe = await TicTacToe.deploy();
        await ticTacToe.deployed();
    });

    //test the getGameInfo function to make sure it returns the correct game information
    it("should return the correct game info", async () => {
        await ticTacToe.createGame();
        await ticTacToe.connect(player1).joinGame(0);
        await ticTacToe.connect(player2).joinGame(0);
        await ticTacToe.startGame(0);
        // Play a move
        await ticTacToe.connect(player1).play(0, 0, 0);
        const gameInfo = await ticTacToe.getGameInfo(0);
        expect(gameInfo.players[0]).to.equal(player1.address);
        expect(gameInfo.players[1]).to.equal(player2.address);
        expect(gameInfo.currentPlayer).to.equal(player2.address);
        expect(gameInfo.board[0][0]).to.equal(player1.address);
        expect(gameInfo.isStarted).to.equal(true);
        expect(gameInfo.winner).to.equal(ethers.constants.AddressZero);
        expect(gameInfo.tie).to.equal(false);
    });

    //test the play function by trying to play in an already occupied cell and checking that it reverts with the correct error message
    it("should revert if player tries to play in an occupied cell", async function () {
        await ticTacToe.createGame();
        await ticTacToe.connect(player1).joinGame(0);
        await ticTacToe.connect(player2).joinGame(0);
        await ticTacToe.startGame(0);
        await expect(ticTacToe.connect(player1).play(0, 0, 0)).to.not.be.reverted;

        await expect(ticTacToe.connect(player1).play(0, 0, 0)).to.be.revertedWith(
            "Cell is already occupied."
        );
    });

    //Test that the createGame() function increments the gameCount variable by 1:
    it("should increment the gameCount variable when creating a new game", async function () {
        const ticTacToe = await TicTacToe.deploy();
        await ticTacToe.createGame();
        const gameCount = await ticTacToe.gameCount();
        expect(gameCount).to.equal(1);
    });

    //Test that the joinGame() function correctly adds a second player to the game
    it("should add a second player to the game when joining a created game", async function () {
        const ticTacToe = await TicTacToe.deploy();
        await ticTacToe.createGame();
        await ticTacToe.connect(player1).joinGame(0);
        await ticTacToe.connect(player2).joinGame(0);
        const { players } = await ticTacToe.getGameInfo(0);
        expect(players[1]).to.equal(player2.address);
    });

    //Test that the startGame() function correctly sets the isStarted variable to true:
    it("should start the game when both players have joined", async function () {
        const ticTacToe = await TicTacToe.deploy();
        await ticTacToe.createGame();
        await ticTacToe.connect(player1).joinGame(0);
        await ticTacToe.connect(player2).joinGame(0);
        await ticTacToe.startGame(0);
        const { isStarted } = await ticTacToe.getGameInfo(0);
        expect(isStarted).to.equal(true);
    });

    //Test that the play() function correctly marks the board with the player's move and switches to the next player's turn
    it("should mark the board with the player's move and switch turns", async function () {
        const ticTacToe = await TicTacToe.deploy();
        await ticTacToe.createGame();
        await ticTacToe.connect(player1).joinGame(0);
        await ticTacToe.connect(player2).joinGame(0);
        await ticTacToe.startGame(0);
        await ticTacToe.connect(player1).play(0, 0, 0);
        const { board, currentPlayer } = await ticTacToe.getGameInfo(0);
        expect(board[0][0]).to.equal(player1.address);
        expect(currentPlayer).to.equal(player2.address);
    });
    /* gameId plus
        |     |     
        0,0| 1,0 | 2,0  
    _____|_____|_____
        |     |     
        0,1| 1,1 | 2,1  
    _____|_____|_____
        |     |     
        0,2| 1,2 | 2,2  
        |     |     
    */
    //Test that the checkWin() function correctly identifies a win
    it("should identify a win for a player when there is a three-in-a-row on the board", async function () {
        const ticTacToe = await TicTacToe.deploy();
        await ticTacToe.createGame();
        await ticTacToe.connect(player1).joinGame(0);
        await ticTacToe.connect(player2).joinGame(0);
        await ticTacToe.startGame(0);
        await ticTacToe.connect(player1).play(0, 0, 0);
        await ticTacToe.connect(player2).play(0, 1, 0);
        await ticTacToe.connect(player1).play(0, 0, 1);
        await ticTacToe.connect(player2).play(0, 1, 1);
        await ticTacToe.connect(player1).play(0, 0, 2);
        const { winner } = await ticTacToe.getGameInfo(0);
        expect(winner).to.equal(player1.address);
    });

});
