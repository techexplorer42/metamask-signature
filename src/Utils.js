import { ethers } from "ethers";
import { checkIfSigned, signDocument } from './contract';

export function unixToISOString(timestamp) {
  const date = new Date(timestamp * 1000);
  return date.toISOString();
}

export const signMessage = async ({ setError, message, onChain }) => {
  try {
    console.log({ message });
    if (!window.ethereum) 
      throw new Error("No crypto wallet found. Please install it.");

    await window.ethereum
      .request({ method: "eth_requestAccounts" })
      .then((result) => {
        // The result varies by RPC method.
        // For example, this method will return a transaction hash hexadecimal string on success.
      })
      .catch((error) => {
        // If the request fails, the Promise will reject with an error.
      });

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const signature = await signer.signMessage(message);
    const address = await signer.getAddress();
    console.log("address:", address);

    var timestamp = false;
    if (onChain) {
      timestamp = await checkIfSigned(address, message);
      console.log("timestamp found\n", timestamp);
      if (!timestamp) {
        // not signed, we should sign the document
        timestamp = await signDocument(address, message);
        console.log("timestamp after signing \n", timestamp);
        if (timestamp) {
          console.log("Successfuly signed on the network");
        }
      } else {
          console.log("The document has already been signed!");
      }
    }

    return { message, signature, address, timestamp};

  } catch (err) {
    setError(err.message);
  }
};

/*************** Metadata Handling **********************/
export const smversion = "0.0";

export function GenMetadata ( _address, _hash, _signature, _timestamp) {
		const signInfo = {
					version: smversion,
					signer : _address,
					hash : _hash,
					signature : _signature,
          timestamp : _timestamp
				}
			const ret = JSON.stringify(signInfo);
			console.log("signInfo " + ret);
			return ret;
}

export function ParseMetadata (_jsoninfo) {
			const info = JSON.parse(_jsoninfo);
			console.log("signInfo parsed " + info);
			return info;
}
