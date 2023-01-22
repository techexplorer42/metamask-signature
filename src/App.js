import SignMessage from "./SignMessage";
import VerifyMessage from "./VerifyMessage";
import ConnectStatus from "./ConnectButton3";
import DonateButton from "./DonateButton";
import styles from "./App.css";

export default function App() {
  return (
    <div >
      <div className="w-full h-12">
				<div className={styles.centerme}>
					<center>
							<p className="font-sans text-3xl"> DoCrySign</p>
					</center>
				</div>
				<div className="w-1/6 absolute top-0 right-0">
					 <ConnectStatus />
				</div>
      </div>
      <div className="w-full h-24">
			</div>
    <div className="flex flex-wrap">
      <div className="w-full lg:w-1/2">
        <SignMessage />
      </div>
      <div className="w-full lg:w-1/2">
        <VerifyMessage />
      </div>
    </div>
		
      <div className="w-full h-12">
			</div>

      <div className="w-full h-12">
				<center>
				<div className="w-1/6">
					 <DonateButton />
				</div>
				</center>
      </div>
    </div>
  );
}
