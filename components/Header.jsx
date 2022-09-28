import { ConnectButton } from "web3uikit";

export default function Header() {
  return (
    <div className="py-5 border-b-2 flex flex-col md:flex-row">
      <h1 className="py-4 px-4 font-blog text-3xl font-mono">
        Decentralized Lottery
      </h1>
      <div className="ml-auto py-2 px-4">
        <ConnectButton moralisAuth={false}></ConnectButton>
      </div>
    </div>
  );
}
