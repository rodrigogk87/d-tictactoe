import { ethers } from 'hardhat';

async function main() {
  const TicTacToe = await ethers.getContractFactory('TicTacToe');
  const ticTacToe = await TicTacToe.deploy();

  console.log('TicTacToe deployed to:', ticTacToe.address);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
