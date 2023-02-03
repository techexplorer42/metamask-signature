import MetaMaskOnboarding from '@metamask/onboarding'
import { useEffect, useState } from "react";
import { ethers } from "ethers";

export default function ConnectStatus() {
  const [walletAddress, setWalletAddress] = useState("");
  const [walletChainId, setWalletChainId] = useState("");
  const [userAmount, setUserAmount] = useState("");

  useEffect(() => {
    getCurrentWalletConnected();
    addWalletListener();
  }, [walletAddress, walletChainId]);

  const connectWallet = async () => {
    if (typeof window != "undefined" && typeof window.ethereum != "undefined") {
      try {
        /* MetaMask is installed */
        /* fetch account */
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setWalletAddress(accounts[0]);
        console.log(accounts[0]);
        /* fetch chainId */
        const chainId = await window.ethereum.request({
          method: 'eth_chainId'
        });
        setWalletChainId(chainId);
        console.log(chainId);
      } catch (err) {
        console.error(err.message);
      }
    } else {
      /* MetaMask is not installed */
      console.log("Please install MetaMask");
    }
  };

  const getCurrentWalletConnected = async () => {
    if (typeof window != "undefined" && typeof window.ethereum != "undefined") {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_accounts",
        });
        if (accounts.length > 0) {
          setWalletAddress(accounts[0]);
          console.log(accounts[0]);
        } else {
          console.log("Connect to MetaMask using the Connect button");
          return;
        }
        /* fetch chainId */
        const chainId = await window.ethereum.request({
          method: 'eth_chainId'
        });
        if (chainId.length > 0) { /* if we are here, should be always true!? */
          setWalletChainId(chainId);
          console.log(chainId);
        } else {
          console.log("Connect to MetaMask using the Connect button");
        }
      } catch (err) {
        console.error(err.message);
      }
    } else {
      /* MetaMask is not installed */
      console.log("Please install MetaMask");
    }
  };

  const addWalletListener = async () => {
    if (typeof window != "undefined" && typeof window.ethereum != "undefined") {
      window.ethereum.on("accountsChanged", (accounts) => {
        setWalletAddress(accounts[0]);
        console.log(accounts[0]);
      });
      window.ethereum.on("chainChanged", (chainId) => {
        setWalletAddress(chainId);
        console.log(chainId);
      });
    } else {
      /* MetaMask is not installed */
      setWalletAddress("");
      console.log("Please install MetaMask");
    }
  };

  const onInputChange = async event => {
    if (event.target.validity.valid) {
      setUserAmount(event.target.value);
    }
  };


	return (
		    <button id="connectButton"  type="submit" className="btn btn-info submit-button focus:ring focus:outline-none w-full w-64 h-16" onClick={connectWallet}>
          <span className="is-link has-text-weight-bold">
            {walletAddress && walletAddress.length > 0 
              ? `Connected: ${walletAddress.substring(
                  0,
                  6
                )}...${walletAddress.substring(38)}`
              : "Connect Wallet"}
            { walletAddress && walletAddress.length > 0  &&  walletChainId && walletChainId.length > 0
              ? ` (${walletChainId})`
              : ""}
          </span>
        </button>
	)
}
