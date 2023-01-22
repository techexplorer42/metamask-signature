import MetaMaskOnboarding from '@metamask/onboarding'

export default function ConnectStatus() {
  	const handleClickVerify = async (e) => {
  			const onboardButton = document.getElementById('connectButton');
				if (typeof web3 === 'undefined') {
					return alert('You need to install MetaMask to use this feature.')
				}
				if (window.ethereum) {
					await window.ethereum.request({ method: "eth_requestAccounts" });
					window.web3 = new Web3(window.ethereum);
					onboardButton.innerText = "Connected";
			  } else {
					onboardButton.innerText = "Connect";
					console.log("No wallet");
			  }
  	};
	return (
		<div>
		<button id="connectButton" onClick={handleClickVerify} type="submit" className="btn btn-primary submit-button focus:ring focus:outline-none w-full">
    	Connect
    </button>
		</div>
	)
}
