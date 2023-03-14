import { useWeb3React } from "@web3-react/core";
import { Contract, ethers, Signer } from "ethers";
import { useEffect, useState } from "react";
import { Provider } from "../utils/provider";
import TicTacToeContract from '../artifacts/contracts/TicTacToe.sol/TicTacToe.json';

export function useContract() {

    const context = useWeb3React<Provider>();
    const { library, active } = context;
    const [signer, setSigner] = useState<Signer>();
    const [contract, setContract] = useState<Contract>();


    useEffect((): void => {
        if (!library) {
            setSigner(undefined);
            return;
        }

        setSigner(library.getSigner());
    }, [library]);

    useEffect((): void => {
        if (signer) {
            const contract = new ethers.Contract(
                "0x322813Fd9A801c5507c9de605d63CEA4f2CE6c44",
                TicTacToeContract.abi,
                signer
            );
            setContract(contract);
        }
    }, [signer]);

    return { contract };
}
