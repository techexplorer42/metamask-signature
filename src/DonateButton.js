import MetaMaskOnboarding from '@metamask/onboarding'

export default function DonateButton() {
  	const handleClickVerify = event => {
				if (typeof web3 === 'undefined') {
					return alert('You need to install MetaMask to use this feature.')
				}
				var user_address = web3.eth.accounts[0];
				if (typeof user_address === 'undefined') {
					return alert('You need to log in MetaMask to use this feature.')
				}
				web3.eth.sendTransaction({
					to: "0x1155418c315169Da7e947C1D830E669F6b1F2f3e",
					from: user_address,
					value: web3.toWei('0.005', 'ether'),
				}, function (err, transactionHash) {
					if (err) return alert('Thanks for trying out!');
					alert('Thanks for the generosity!!');
				})
  	};
	return (
		<div>
		<button onClick={handleClickVerify} type="submit" className="btn btn-primary submit-button focus:ring focus:outline-none w-full">
    	Donate
    </button>
		</div>
	)
}
