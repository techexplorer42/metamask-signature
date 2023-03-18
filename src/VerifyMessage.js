import { useState, useRef } from "react";
import { ethers } from "ethers";
import ErrorMessage from "./ErrorMessage";
import SuccessMessage from "./SuccessMessage";
import React from 'react';
import JSZip from 'jszip';
import FileSaver from 'file-saver';
import { unixToISOString, ParseMetadata } from './Utils';
const { createHash } = require('crypto');
import { checkIfSigned } from './contract';
import styles from "./VerifyMessage.css";
import { Logout } from './LogArea';
import { FaInfoCircle } from 'react-icons/fa';

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
    const [showModal, setShowModal] = useState(false);
    const iconRef = useRef(null);

    const handleCloseModal = () => setShowModal(false);

    const handleShowModal = () => {
      setShowModal(prevShowModal => !prevShowModal);
      const iconBounds = iconRef.current.getBoundingClientRect();
      setModalPosition({ top: iconBounds.top, left: iconBounds.right + 8 });
    };

    const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });

    const handleVerification = async (e) => {
        e.preventDefault();
    		var fileblob;
        const file = e.target.files[0];
        fileblob = file;
        setSuccessMsg();
        setError();

        var zip = new JSZip();
        zip.loadAsync(fileblob)
            .then(async function(zip) {
                var zfiles = zip.files;
                var fileSignature = "signature.json";
                var fileDoc = "";
                //console.log(zfiles);
								var fNum = 0;
                zip.forEach((relPath, file) => {
                    if (relPath != fileSignature) {
                        fileDoc = relPath;
                    }
										fNum += 1;
                });
                // TODO check that fileSignature and fileAddr exists
                if (fNum != 2) {
                    console.log("there is more or less (" + fNum + ") than 3 files");
                    setError("This archive does not contain 3 files as expected!");
										return;
                }
								// file content goes here
                var doc;
                var signDoc;
                doc = await zip.file(fileDoc).async("text");
                signDoc = await zip.file(fileSignature).async("text");
								// Generate the hash of the document
								var docHash;
								docHash = hash(doc);
								// extract signature and address (parse json then put in variables)
								const signInfo = ParseMetadata(signDoc);
								//check signature
								var isValid = false;
								var addr;
                var fileHash;
								var signature;
								var timestamp;
								addr = signInfo.signer;
								fileHash = signInfo.hash;
								signature = signInfo.signature;
								timestamp = signInfo.timestamp;
                const ofrst = document.getElementById('pfirst');
                const osec = document.getElementById('psec');
                const othird = document.getElementById('pthird');
                const block_timestamp = await checkIfSigned(addr, fileHash);
                console.log("block_timestamp:", block_timestamp);
                
								if (signInfo) {
                  Logout("Verifying..." + fileDoc + "\n");
									isValid = await verifyMessage({
											setError,
											message: docHash,
											address: addr,
											signature: signature
									});
								}
                if (isValid) {
                    setSuccessMsg("Signature is valid!");
                    ofrst.innerHTML = "<b> Hash: " +  fileHash + "</b>";
                    osec.innerHTML = "Signer: " + addr;
                    othird.innerHTML = "Date: " +  unixToISOString(timestamp);
                    Logout("Valid. The Signer is: " + addr + "; fileHash: " + fileHash + "; timestamp: " + timestamp + "\n");
                } else {
                    setError("Invalid signature");
                    Logout("Invalid Signature \n");
                }
            })
    };

	  // Create a reference to the hidden file input element
    const hiddenFileInputVerify = React.useRef(null);

  	const handleClickVerify = event => {
    		hiddenFileInputVerify.current.click();
  	};

    return (
				<div className="credit-card w-full shadow-lg mx-auto rounded-xl bg-white border border-primary h-70">
					<main className="mt-4 p-2">
          <center>
            <h1 className="text-xl font-semibold text-gray-700" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }} ref={iconRef}>
							Verify Signature <FaInfoCircle className="info-icon" onClick={handleShowModal} style={{ marginLeft: '0.5rem', cursor: 'pointer' }} ref={iconRef} />
						</h1>
          </center>
					</main>
				  <div className="mt-2 p-2">
						<input className="file-input" type="file"  ref={hiddenFileInputVerify} id="file-selector" onChange={handleVerification} style={{display: 'none'}} />
						<button onClick={handleClickVerify} type="submit" className="btn btn-primary submit-button focus:ring focus:outline-none w-full">
							Select & Verify
						</button>
  				</div>
  				<div className="h-12 m-1 grid content-center">
            <div>
						<ErrorMessage message={error} />
						<SuccessMessage message={successMsg} />
            </div>
					</div>
  				<div className="h-8 m-1 grid content-center">
            <div>
						<p id="pfirst"  className="small" ></p>
            </div>
					</div>
  				<div className="h-8 m-1 grid content-center">
            <div>
						<p id="psec" className="small" ></p>
            </div>
					</div>
  				<div className="h-7 m-1 grid content-center">
            <div>
						<p id="pthird"  className="small"  ></p>
            </div>
					</div>
         {showModal && (
          <div className="modal-popup" onClick={handleCloseModal}>
            <div className="popup-content" style={{ position: 'absolute', top: modalPosition.top, left: modalPosition.left, zIndex: 1, backgroundColor: '#fff', padding: '1rem', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', borderRadius: '0.5rem' }}>
              <p> Verify an already signed archive ("zip"). Just select it and the verification will be done. </p>
            </div>
          </div>
        )}
				</div>
    );
}
