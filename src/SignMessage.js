import { useState, useRef } from "react";
import { ethers } from "ethers";
import React from 'react';
import ErrorMessage from "./ErrorMessage";
import JSZip from 'jszip';
import FileSaver from 'file-saver';

const signMessage = async ({
    setError,
    message
}) => {
    try {
        console.log({
            message
        });
        if (!window.ethereum)
            throw new Error("No crypto wallet found. Please install it.");
        // ("eth_requestAccounts");
        await window.ethereum.request({
                method: 'eth_requestAccounts'
            }).then((result) => {
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

    const handleFileInput = async (e) => {
        const file = e.target.files[0];
        const fileName = file.name;
        console.log("File Handling");
        console.log(Object.keys(file));
        const fnp = document.getElementById('filename');
        const fsp = document.getElementById('filesize');
        const output = document.getElementById('output');
        const signature = document.getElementById('signature');
        fnp.textContent = "File name: " + file.name;
				fsp.textContent = "File Size: " + file.size;

        async function handleFile() {
            const fileContent = event.target.result;
            // output.innerText = fileContent;
            const sig = await signMessage({
                setError: console.log,
                message: fileContent
            });
            signature.innerText = sig.signature;

            const zip = new JSZip();
            // zip.file(fileName, fileContent);
            zip.file(fileName, fileContent);
            zip.file('signature.txt', sig.signature);
            zip.file('address.txt', sig.address);
            zip.generateAsync({
                type: 'blob'
            }).then(function(content) {
                FileSaver.saveAs(content, 'signed_document.zip');
            });
        }
        const reader = new FileReader();
        reader.addEventListener('load', handleFile);
        reader.readAsText(file);
    }
	  // Create a reference to the hidden file input element
    const hiddenFileInput = React.useRef(null);

  	const handleClick = event => {
    		hiddenFileInput.current.click();
        console.log("button click...");
  	};

    return (
    <div className="credit-card w-full shadow-lg mx-auto rounded-xl bg-white">
        <main className="mt-4 p-4">
          <h1 className="text-xl font-semibold text-gray-700 text-center">
            Sign a File
          </h1>
			  </main>
				<input className="file-input" type="file"  ref={hiddenFileInput} id="file-selector" onChange={handleFileInput} style={{display: 'none'}} />
				<button onClick={handleClick} type="submit" className="btn btn-primary submit-button focus:ring focus:outline-none w-full">
					Select & Sign
				</button>
				<div >
				<p id="filename"></p>
				<p id="filesize"></p>
				<div className="flex-wrap" id="signature"></div>
				</div>
    </div>
    );
}
