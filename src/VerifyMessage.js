import { useState, useRef } from "react";
import { ethers } from "ethers";
import ErrorMessage from "./ErrorMessage";
import SuccessMessage from "./SuccessMessage";
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
    var fileblob;
    const handleFileInputVerify = async (e) => {
        const file = e.target.files[0];
        const verifyfilestatus = document.getElementById('verifyfilestatus');
        verifyfilestatus.textContent = "Loaded file size is: " + file.size;
        fileblob = file;
    }

    const handleVerification = async (e) => {
        e.preventDefault();
        const data = new FormData(e.target);
        setSuccessMsg();
        setError();

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
                signature = await zip.file(fileSignature).async("text");
                doc = await zip.file(fileDoc).async("text");
                addr = await zip.file(fileAddr).async("text");
                console.log(signature);
                console.log(addr);
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

    return (
			<form className="m-4" onSubmit={handleVerification}>
				<div className="credit-card w-full shadow-lg mx-auto rounded-xl bg-white">
					<main className="mt-4 p-4">
						<h1 className="text-xl font-semibold text-gray-700 text-center">
							Verify signature
						</h1>
						<div className="">
							<div className="my-3">
					<input style={{color: "red"}}  type="file" id="file-selector" onChange={handleFileInputVerify} />
					<p id="verifyfilestatus"></p>
							</div>
						</div>
					</main>
					<footer className="p-4">
						<button type="submit" className="btn btn-primary submit-button focus:ring focus:outline-none w-full">
							Verify Signed Archive
						</button>
					</footer>
					<div className="p-4 mt-4">
						<ErrorMessage message={error} />
						<SuccessMessage message={successMsg} />
					</div>
				</div>
			</form>
    );
}
