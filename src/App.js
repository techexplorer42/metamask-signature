import SignMessage from "./SignMessage";
import VerifyMessage from "./VerifyMessage";
import ConnectStatus from "./ConnectButton";
import DonateButton from "./DonateButton";
import LogArea from "./LogArea";
import styles from "./App.css";

export default function App() {
  return (
    <div>
      <nav className="flex justify-between items-center h-16 bg-gray-800 text-white">
        <div className="ml-4">
          <a href="/" className="text-white font-bold text-lg">
            DocrySign
          </a>
        </div>
        <div className="mr-4">
          <ConnectStatus />
        </div>
      </nav>
      <div className="w-full h-12" />
      <div className="flex flex-wrap flex-wrap-gap">
        <div className="w-full lg:w-1/2">
          <SignMessage />
        </div>
        <div className="w-full lg:w-1/2">
          <VerifyMessage />
        </div>
      </div>
      <div className="mt-2 p-2">
        <LogArea />
      </div>
      <div className="w-full h-12">
        <center>
          <div className="w-2/6">
            <DonateButton />
          </div>
        </center>
      </div>
    </div>
  );
}


