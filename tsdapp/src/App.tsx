import { ReactElement } from 'react';
import styled from 'styled-components';
import { ActivateDeactivate } from './components/ActivateDeactivate';
import { TicTacToe } from './components/TicTacToe';
import { WalletStatus } from './components/WalletStatus';


const StyledAppDiv = styled.div`
  display: grid;
  grid-gap: 20px;
`;

export function App(): ReactElement {
  return (
    <StyledAppDiv>
      <ActivateDeactivate />
      <WalletStatus />
      <TicTacToe />
    </StyledAppDiv>
  );
}
