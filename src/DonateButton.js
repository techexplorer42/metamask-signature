import { useEffect, useState } from "react";
import MetaMaskOnboarding from '@metamask/onboarding'
import detectEthereumProvider from '@metamask/detect-provider';

export default function DonateButton() {
  const gotodonation = async event => {
    const link = "https://gizeam.com/?name=DocrySign&addr=0x1155418c315169da7e947c1d830e669f6b1f2f3e";
    window.location.href = link;    
  }
	return (
    <div>
      <button onClick={gotodonation} type="submit" className="btn btn-primary submit-button focus:ring focus:outline-none w-full">
        Donate
      </button>
		</div>
	)
}
