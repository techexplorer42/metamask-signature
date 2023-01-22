import { useState, useRef } from "react";
import { ethers } from "ethers";
import React from 'react';
import ErrorMessage from "./ErrorMessage";
import GenMetadata from "./Metadata";
import JSZip from 'jszip';
import FileSaver from 'file-saver';

const { createHash } = require('crypto');

function hash(string) {
  return createHash('sha256').update(string).digest('hex');
}

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
        //const addresses = await signer.getSigners();
        //const address = addresses[0];
        const address = await signer.getAddress(); 
				console.log("address:", address);

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
    const [signatures, setSignatures] = useState([]);
    const [error, setError] = useState();
    var file = null;
    var fileName = name;

    const handleFileInput = async (e) => {
        file = e.target.files[0];
        fileName = file.name;
        const fnp = document.getElementById('filename');
        fnp.textContent = "Uploaded File: " + fileName;

    }

    const handleSign = async (e) => {
        if (!file ) {
						console.log("Please Select a file");
						return;
				}
        fileName = file.name;
        const fhs = document.getElementById('filehash');

        async function handleFile() {
            const fileContent = event.target.result;
						const fileHash = hash(fileContent);
						fhs.textContent = "File Hash: " + fileHash;
            const sig = await signMessage({
                setError: console.log,
                message: fileHash
            });

						const metadata = GenMetadata(sig.address,sig.signature);
            const zip = new JSZip();
            zip.file(fileName, fileContent);
            zip.file('signature.json', metadata);
            zip.generateAsync({
                type: 'blob'
            }).then(function(content) {
								var resultContent = content;
                FileSaver.saveAs(resultContent, fileName + '.zip');
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
  	};

    return (
    <div className="credit-card w-full shadow-lg mx-auto rounded-xl bg-white">
        <main className="mt-4 p-4">
          <h1 className="text-xl font-semibold text-gray-700 text-center">
            Sign Document
          </h1>
			  </main>
				<div className="mt-2 p-2">
					<input className="file-input" type="file"  ref={hiddenFileInput} id="file-selector" onChange={handleFileInput} style={{display: 'none'}} />
					<button onClick={handleClick} type="submit" className="btn btn-primary submit-button focus:ring focus:outline-none w-full">
						Upload
					</button>
					<p id="filename"> </p>
				</div>
				<div className="mt-2 p-2">
					<button onClick={handleSign} type="submit" className="btn btn-primary submit-button focus:ring focus:outline-none w-full">
						Sign
					</button>
					<p id="filehash"> </p>
				</div>
    </div>
    );
}
