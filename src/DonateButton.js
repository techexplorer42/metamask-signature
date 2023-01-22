import MetaMaskOnboarding from '@metamask/onboarding'
import detectEthereumProvider from '@metamask/detect-provider';







/*********************************************/
/* Access the user's accounts (per EIP-1102) */
/*********************************************/

// You should only attempt to request the user's accounts in response to user
// interaction, such as a button click.
// Otherwise, you popup-spam the user like it's 1999.
// If you fail to retrieve the user's account(s), you should encourage the user
// to initiate the attempt.
document.getElementById('connectButton', connect);

// While you are awaiting the call to eth_requestAccounts, you should disable
// any buttons the user can click to initiate the request.
// MetaMask will reject any additional requests while the first is still
// pending.
function connect() {
  ethereum
    .request({ method: 'eth_requestAccounts' })
    .then(handleAccountsChanged)
    .catch((err) => {
      if (err.code === 4001) {
        // EIP-1193 userRejectedRequest error
        // If this happens, the user rejected the connection request.
        console.log('Please connect to MetaMask.');
      } else {
        console.error(err);
      }
    });
}

export default function DonateButton() {
  	const handleDonate = async event => {

				// this returns the provider, or null if it wasn't detected
				const provider = await detectEthereumProvider();
				if (!provider) {
					console.log('Please install MetaMask!');
					return alert('You need to install MetaMask to use this feature.')
				}

				// chainId
				const chainId = await ethereum.request({ method: 'eth_chainId' });

				const currentAccounts = await ethereum.request({ method: 'eth_accounts' });
				if (typeof currentAccounts === 'undefined') {
					return alert('You need to log in MetaMask to use this feature.')
				}
				var user_address = currentAccounts[0];

				const transactionParameters = {
					to: "0x1155418c315169Da7e947C1D830E669F6b1F2f3e", // Required except during contract publications.
					from: user_address, // must match user's active address.
					value: '0x10000', // Only required to send ether to the recipient from the initiating external account.
					chainId: chainId, // Used to prevent transaction reuse across blockchains. Auto-filled by MetaMask.
				};

				// txHash is a hex string
				// As with any RPC call, it may throw an error
				const txHash = await ethereum.request({
					method: 'eth_sendTransaction',
					params: [transactionParameters],
				});
  	};
	return (
		<div>
		<button onClick={handleDonate} type="submit" className="btn btn-primary submit-button focus:ring focus:outline-none w-full">
    	Donate
    </button>
		</div>
	)
}
