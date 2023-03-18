import MetaMaskOnboarding from '@metamask/onboarding'
import { useEffect, useState } from "react";
import { ethers } from "ethers";


//import Web3 from 'web3';
//
//if (window.ethereum) {
//  window.web3 = new Web3(window.ethereum);
//  try {
//    // Request account access if needed
//    await window.ethereum.enable();
//  } catch (error) {
//    // User denied account access...
//  }
//}
//// Legacy DApp Browsers
//else if (window.web3) {
//  window.web3 = new Web3(window.web3.currentProvider);
//}
//// Non-DApp Browsers
//else {
//  console.log('You have to install MetaMask !');
//}


export default function ConnectStatus({walletAddress, setWalletAddress, walletChainId, setWalletChainId}) {

  useEffect(() => {
    getCurrentWalletConnected();
    addWalletListener();
  }, [walletAddress, walletChainId]);

  const connectWallet = async () => {
    if (!(typeof window != "undefined" && typeof window.ethereum != "undefined")) 
    {
      console.log("Please install MetaMask");
      return;
    }
    try {
      /* MetaMask is installed; fetch account */
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
  };

  const getCurrentWalletConnected = async () => {
    if (!(typeof window != "undefined" && typeof window.ethereum != "undefined")) 
    {
      console.log("Please install MetaMask");
      return;
    }
    try {
      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });
      if (accounts.length > 0) {
        setWalletAddress(accounts[0]);
        console.log("getCurrentWalletConnected accounts", accounts[0]);
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
        console.log("getCurrentWalletConnected chainId", chainId);
      } else {
        console.log("Connect to MetaMask using the Connect button");
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  const addWalletListener = async () => {
    if (!(typeof window != "undefined" && typeof window.ethereum != "undefined")) 
    {
      /* MetaMask is not installed */
      setWalletAddress("");
      console.log("Please install MetaMask");
      return;
    }
    window.ethereum.on("accountsChanged", (accounts) => {
      setWalletAddress(accounts[0]);
      console.log(accounts[0]);
    });
    window.ethereum.on("chainChanged", (chainId) => {
      setWalletAddress(chainId);
      console.log(chainId);
    });
  };

	return (
    <button id="connectButton"  type="submit" className="btn btn-primary submit-button focus:ring focus:outline-none w-full w-64 h-16" onClick={connectWallet}>
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
