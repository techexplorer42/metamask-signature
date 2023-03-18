import SignMessage from "./SignMessage";
import VerifyMessage from "./VerifyMessage";
import ConnectStatus from "./ConnectButton";
import DonateButton from "./DonateButton";
import LogArea from "./LogArea";
import Footer from "./Footer";
import styles from "./App.css";
import { useState } from "react";

export default function App() {
  const [walletAddress, setWalletAddress] = useState("");
  const [walletChainId, setWalletChainId] = useState("");

  return (
    <div className="App flex flex-col">
      <div className="content-wrapper flex-grow pb-24">
      <nav className="flex justify-between items-center h-16 bg-gray-800 text-white">
        <div className="ml-4">
          <a href="/" className="text-white font-bold text-lg">
            DocrySign
          </a>
        </div>
        <div className="mr-4">
          <ConnectStatus {...{walletAddress, setWalletAddress, walletChainId, setWalletChainId}} />
        </div>
      </nav>
      <div className="w-full h-12" />
      <div className="flex flex-wrap flex-wrap-gap">
        <div className="w-full lg:w-1/2">
          <SignMessage {...{walletAddress, walletChainId}} />
        </div>
        <div className="w-full lg:w-1/2">
          <VerifyMessage />
        </div>
      </div>
      <div className="mt-2 p-2">
        <LogArea />
      </div>
      <div>
      <Footer />
      </div>
      </div>
    </div>
  );
}


