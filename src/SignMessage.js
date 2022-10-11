import { useState, useRef } from "react";
import { ethers } from "ethers";
import ErrorMessage from "./ErrorMessage";

const signMessage = async ({ setError, message }) => {
  try {
    console.log({ message });
    if (!window.ethereum)
      throw new Error("No crypto wallet found. Please install it.");

    await window.ethereum.send("eth_requestAccounts");
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const signature = await signer.signMessage(message);
    const address = await signer.getAddress();

    return {
      message,
      signature,
      address
    };
  } catch (err) {
    setError(err.message);
  }
};

export default function SignMessage() {
  const resultBox = useRef();
  const [signatures, setSignatures] = useState([]);
  const [error, setError] = useState();

  const handleSign = async (e) => {
    e.preventDefault();
    console.log("Handler called!");
      const _status = document.getElementById('status');
    console.log("Handler called 2!");
      const output = document.getElementById('output');
    console.log("Handler called 3!");
      if (window.FileList && window.File && window.FileReader) {
    console.log("Handler called 4!");
        document.getElementById('file-selector').addEventListener('input', e => {
    console.log("Handler called 5!");
          output.innerText = '';
          _status.innerText = '';
          const file = e.target.files[0];
          if (!file.type) {
            _status.innerText = 'Error: The File.type property does not appear to be supported on this browser.';
            return;
          }
          output.innerText = file.size;
          const reader = new FileReader();
	  reader.addEventListener('load', event => { 
		  
	  });
	  reader.readAsText(file);
        }); 
    	console.log("No file change?!");
      } else {
    	console.log("No file selected?!");
      }
  };
    const handleFileInput = async (e) => {
  	const file = e.target.files[0];
  	if (file.size > 1024) {
    		console.log("File size cannot exceed more than 1MB");
  	} else {
    		console.log("File size below 1MB");
      		const status = document.getElementById('status');
      		const output = document.getElementById('output');
      		const signature = document.getElementById('signature');
          	status.textContent = file.size;
          	output.textContent = file.size;
            	//status.textContent = 'Error: The File.type property does not appear to be supported on this browser.';

		  async function handleFile(){
			output.innerText = event.target.result;
			const sig = await signMessage({ setError: console.log, message :  event.target.result });
			signature.innerText = sig.signature;
		  }
		  const reader = new FileReader();
		  reader.addEventListener('load', handleFile);
		  reader.readAsText(file);
	}
    }

  return (
    <div>
    <h1>
      Read an image file
    </h1>
    <input type="file" id="file-selector" onChange={handleFileInput} />
    <p id="status"></p>
    <div>
      <p id="output"></p>
      <p id="signature"></p>
    </div>
    </div>
  );
}
