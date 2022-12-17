import SignMessage from "./SignMessage";
import VerifyMessage from "./VerifyMessage";
import ConnectStatus from "./ConnectButton";
import DonateButton from "./DonateButton";

export default function App() {
  return (
    <div >
      <div className="w-full h-12">
				<div className="w-5/6 absolute top-0 left-0">
					<center>
					<p> DoCrySign</p>
					</center>
				</div>
				<div className="w-1/6 absolute top-0 right-0">
					 <ConnectStatus />
				</div>
      </div>
    <div className="flex flex-wrap">
      <div className="w-full lg:w-1/2">
        <SignMessage />
      </div>
      <div className="w-full lg:w-1/2">
        <VerifyMessage />
      </div>
    </div>
      <div className="w-full">
				<div className="w-1/6">
					 <DonateButton />
				</div>
      </div>
    </div>
  );
}
