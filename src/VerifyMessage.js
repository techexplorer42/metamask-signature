import { useState, useRef } from "react";
import { ethers } from "ethers";
import ErrorMessage from "./ErrorMessage";
import SuccessMessage from "./SuccessMessage";
import React from 'react';
import JSZip from 'jszip';
import FileSaver from 'file-saver';
const { createHash } = require('crypto');

function hash(string) {
  return createHash('sha256').update(string).digest('hex');
}

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
        const file = e.target.files[0];
        const verifyfilename = document.getElementById('verifyfilename');
        const verifyfilesize = document.getElementById('verifyfilesize');
        const verifyfilesignature = document.getElementById('verifyfilesignature');
        fileblob = file;
        setSuccessMsg();
        setError();

        var zip = new JSZip();
        zip.loadAsync(fileblob)
            .then(async function(zip) {
                var zfiles = zip.files;
                var fileSignature = "signature.txt";
                var fileDoc = "";
                var fileAddr = "address.txt";
                //console.log(zfiles);
								var fNum = 0;
                zip.forEach((relPath, file) => {
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
        				verifyfilename.textContent = "File name: " + fileDoc;
                var doc = 'doc';
                var addr = 'add';
                var signature = 'sig';
                signature = await zip.file(fileSignature).async("text");
                doc = await zip.file(fileDoc).async("text");
								const docHash = hash(doc);
                addr = await zip.file(fileAddr).async("text");
        				verifyfilesize.textContent = "File size: " + doc.length;
        				verifyfilesignature.textContent = "Signer Address: " + addr;
                const isValid = await verifyMessage({
                    setError,
                    message: docHash,
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
						<p id="verifyfilesignature"></p>
						<ErrorMessage message={error} />
						<SuccessMessage message={successMsg} />
					</div>
				</div>
    );
}
