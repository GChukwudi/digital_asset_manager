import { useState } from "react";
import "../styles/ConnectWallet.css";

const ConnectWallet = ({ onConnect }) => {
  const [account, setAccount] = useState(null);

  const connectWallet = async () => {
    if (window.ethereum) {
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      setAccount(accounts[0]);
      onConnect(accounts[0]);
    }
  };

  return (
    <div className="wallet-connect">
      {account ? (
        <p>Connected: {account}</p>
      ) : (
        <button onClick={connectWallet}>Connect Wallet</button>
      )}
    </div>
  );
};

export default ConnectWallet;
