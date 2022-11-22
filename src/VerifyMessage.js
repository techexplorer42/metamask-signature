import { useState, useRef } from "react";
import { ethers } from "ethers";
import ErrorMessage from "./ErrorMessage";
import SuccessMessage from "./SuccessMessage";
import React from 'react';
import JSZip from 'jszip';
import FileSaver from 'file-saver';

const verifyMessage = async ({
    message,
    address,
    signature
}) => {
    try {
        const signerAddr = await ethers.utils.verifyMessage(message, signature);
        if (signerAddr !== address) {
            return false;
        }

        return true;
    } catch (err) {
        console.log(err);
        return false;
    }
};

export default function VerifyMessage() {
    const [error, setError] = useState();
    const [successMsg, setSuccessMsg] = useState();

    const handleVerification = async (e) => {
        e.preventDefault();
    		var fileblob;
        const verifyfilesignature = document.getElementById('verifyfilesignature');
        const file = e.target.files[0];
        const verifyfilename = document.getElementById('verifyfilename');
        const verifyfilesize = document.getElementById('verifyfilesize');
        verifyfilename.textContent = "File name: " + file.name;
        verifyfilesize.textContent = "File size: " + file.size;
        fileblob = file;
        setSuccessMsg();
        setError();

       	console.log("mile");
        var zip = new JSZip();
        zip.loadAsync(fileblob)
            .then(async function(zip) {
                var zfiles = zip.files;
                var fileSignature = "signature.txt";
                var fileDoc = "";
                var fileAddr = "address.txt";
                console.log(zfiles);
								var fNum = 0;
                zip.forEach((relPath, file) => {
                    console.log(relPath);
                    if (relPath != fileAddr && relPath != fileSignature) {
                        fileDoc = relPath;
                    }
										fNum += 1;
                });
                // TODO check that fileSignature and fileAddr exists
                if (fNum != 3) {
                    console.log("there is more or less (" + fNum + ") than 3 files");
                    setError("This archive does not contain 3 files as expected!");
										return;
                }
                var doc = 'doc';
                var addr = 'add';
                var signature = 'sig';
        				console.log("filesignature..." +  fileSignature);
                signature = await zip.file(fileSignature).async("text");
        				console.log("mile");
                doc = await zip.file(fileDoc).async("text");
                addr = await zip.file(fileAddr).async("text");
        				console.log("mile");
                console.log(signature);
                console.log(addr);
        				console.log("mile");
                const isValid = await verifyMessage({
                    setError,
                    message: doc,
                    address: addr,
                    signature: signature
                });

                if (isValid) {
                    setSuccessMsg("Signature is valid!");
                } else {
                    setError("Invalid signature");
                }
            })
    };

	  // Create a reference to the hidden file input element
    const hiddenFileInputVerify = React.useRef(null);

  	const handleClickVerify = event => {
    		hiddenFileInputVerify.current.click();
        console.log("button click...");
  	};

    return (
				<div className="credit-card w-full shadow-lg mx-auto rounded-xl bg-white">
					<main className="mt-4 p-4">
						<h1 className="text-xl font-semibold text-gray-700 text-center">
							Verify signature
						</h1>
					</main>
					<input className="file-input" type="file"  ref={hiddenFileInputVerify} id="file-selector" onChange={handleVerification} style={{display: 'none'}} />
					<button onClick={handleClickVerify} type="submit" className="btn btn-primary submit-button focus:ring focus:outline-none w-full">
						Select & Verify
					</button>
  				<div>
						<p id="verifyfilename"></p>
						<p id="verifyfilesize"></p>
						<ErrorMessage message={error} />
						<SuccessMessage message={successMsg} />
					</div>
				</div>
    );
}
