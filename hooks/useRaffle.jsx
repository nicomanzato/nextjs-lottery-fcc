import { useWeb3Contract, useMoralis } from "react-moralis";
import { abi, contractAddreses } from "../constants";

export const useRaffle = (functionName, msgValue) => {
  const { chainId: chainIdHex } = useMoralis();
  const chainId = parseInt(chainIdHex, 16);

  const raffleAddress =
    chainId in contractAddreses ? contractAddreses[chainId][0] : null;

  const result = useWeb3Contract({
    abi,
    contractAddress: raffleAddress,
    functionName,
    params: {},
    msgValue,
  });

  return result;
};
