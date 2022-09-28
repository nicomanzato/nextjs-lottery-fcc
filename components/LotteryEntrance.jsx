import { useEffect, useState } from "react";
import { useMoralis, useWeb3Contract } from "react-moralis";
import { abi, contractAddreses } from "../constants";
import { ethers } from "ethers";
import { useNotification } from "web3uikit";
import { useRaffle } from "../hooks/useRaffle";

export default function LotteryEntrance() {
  const { chainId: chainIdHex, isWeb3Enabled } = useMoralis();
  const [entranceFee, setEntranceFee] = useState(0);
  const chainId = parseInt(chainIdHex, 16);
  const [recentWinner, setRecentWinner] = useState();
  const [numberOfPlayers, setNumberOfPlayers] = useState(0);
  const raffleAddress =
    chainId in contractAddreses ? contractAddreses[chainId][0] : null;

  const dispatch = useNotification();

  const { runContractFunction: getEntranceFee } = useRaffle("getEntranceFee");

  const { runContractFunction: getNumberOfPlayers } =
    useRaffle("getNumberOfPlayers");

  const { runContractFunction: getRecentWinner } = useRaffle("getRecentWinner");

  const {
    runContractFunction: enterRaffle,
    isFetching,
    isLoading,
  } = useRaffle("enterRaffle", entranceFee);

  const handleSuccess = async (tx) => {
    await tx.wait(1);
    handleNewNotificacion(tx);
    updateUI();
  };

  const handleNewNotificacion = async () => {
    dispatch({
      type: "info",
      message: "Transaction Complete!",
      title: "Tx Notification",
      position: "topR",
    });
  };

  const updateUI = () => {
    getEntranceFee({ onError: (error) => console.log(error) })
      .then((value) => setEntranceFee(value))
      .catch((e) => console.log(e));

    getNumberOfPlayers({ onError: (e) => console.log(e) }).then((value) =>
      setNumberOfPlayers(value)
    );

    getRecentWinner({ onError: (e) => console.log(e) }).then((value) =>
      setRecentWinner(value)
    );
  };

  useEffect(() => {
    if (isWeb3Enabled) {
      updateUI();
    }
  }, [isWeb3Enabled]);

  return (
    <div className="p-5 flex flex-1 flex-col align-center justify-center">
      {raffleAddress ? (
        <div className="h-80 p-8 flex flex-col justify-between items-between bg-blue-100 rounded-xl">
          <div className="text-base">
            Entrance Fee: {ethers.utils.formatUnits(entranceFee, "ether")} ETH
          </div>
          <div className="text-base">
            Number of players: {numberOfPlayers.toString()}
          </div>
          <div className="text-base">Recent Winner: {recentWinner}</div>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 h-12 justify-center rounded ml-auto min-w-full items-center flex flex-col"
            disabled={isLoading || isFetching}
            onClick={async function () {
              await enterRaffle({
                onSuccess: handleSuccess,
                onError: (error) => console.log(error),
              });
            }}
          >
            {isLoading || isFetching ? (
              <div className="animate-spin spinner-border h-8 w-8 border-b-2 rounded-full"></div>
            ) : (
              <div className="text-base">Enter Raffle</div>
            )}
          </button>
        </div>
      ) : (
        <div className="text-base">No Raffle address detected</div>
      )}
    </div>
  );
}
