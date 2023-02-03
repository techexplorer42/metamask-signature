import SignMessage from "./SignMessage";
import VerifyMessage from "./VerifyMessage";
import ConnectStatus from "./ConnectButton3";
import DonateButton from "./DonateButton";
import LogArea from "./LogArea";
import styles from "./App.css";

export default function App() {
  return (
    <div >
      <div className="w-9/12">
				<div className={styles.centerme}>
					<center>
            <img src="brand.png" alt="DocrySign" />
					</center>
				</div>
				<div className="w-3/12 absolute top-0 right-0 h-12">
					 <ConnectStatus />
				</div>
      </div>

      <div className="w-full h-12">
			</div>

      <div className="flex flex-wrap">
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
