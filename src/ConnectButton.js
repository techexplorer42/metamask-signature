import MetaMaskOnboarding from '@metamask/onboarding'

export default function ConnectStatus() {
  const currentUrl = new URL(window.location.href)
  //Created check function to see if the MetaMask extension is installed
  const isMetaMaskInstalled = () => {
    //Have to check the ethereum binding on the window object to see if it's installed
    const { ethereum } = window;
		console.log(ethereum);
		console.log(ethereum.isMetaMask);
		console.log(MetaMaskOnboarding.isMetaMaskInstalled());
    return Boolean(ethereum && ethereum.isMetaMask);
  };
  const MetaMaskClientCheck = () => {
  	const onboardButton = document.getElementById('connectButton');
    //Now we check to see if MetaMask is installed
    if (!isMetaMaskInstalled()) {
      //If it isn't installed we ask the user to click to install it
      onboardButton.innerText = 'Click here to install MetaMask!';
			//When the button is clicked we call this function
			onboardButton.onclick = onClickInstall;
			//The button is now disabled
			onboardButton.disabled = false;
    } else {
      //If it is installed we change our button text
      onboardButton.innerText = 'Connect';
			//When the button is clicked we call this function to connect the users MetaMask Wallet
			onboardButton.onclick = onClickConnect;
			//The button is now enabled
			onboardButton.disabled = false;
    }
  };
	//This will start the onboarding proccess
	const onClickInstall = () => {
  	//We create a new MetaMask onboarding object to use in our app
		const onboarding = new MetaMaskOnboarding();

  	const onboardButton = document.getElementById('connectButton');
		onboardButton.innerText = 'Onboarding in progress';
		onboardButton.disabled = true;
		//On this object we have startOnboarding which will start the onboarding process for our end user
		onboarding.startOnboarding();
	};

	const onClickConnect = async () => {
		try {
			// Will open the MetaMask UI
			// You should disable this button while the request is pending!
			await ethereum.request({ method: 'eth_requestAccounts' });
		} catch (error) {
			console.error(error);
		}
	};

	window.onload = function () {
		MetaMaskClientCheck();
	}
	return (
		<div>
		<button className="btn btn-primary btn-lg btn-block mb-3" id="connectButton" disabled>
    	Connect
    </button>
		</div>
	)
}
