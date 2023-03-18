import { unixToISOString, ParseMetadata, GenMetadata } from './Utils';
import { Tooltip } from 'react-bootstrap';
import React, { useState, useRef } from "react";
import ErrorMessage from "./ErrorMessage";
import SuccessMessage from "./SuccessMessage";
import JSZip from "jszip";
import FileSaver from "file-saver";
import styles from "./App.css";
import { createHash } from "crypto";
import { signMessage } from './Utils';
import { Logout } from './LogArea';
import { FaInfoCircle } from 'react-icons/fa';

const hash = (string) => createHash("sha256").update(string).digest("hex");

export default function SignMessage({walletAddress, walletChainId}) {
  const [error, setError] = useState();
  const [successMsg, setSuccessMsg] = useState();
  const [file, setFile] = useState();
  const [fileLoaded, setFileLoaded] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const hiddenFileInput = useRef(null);
  const iconRef = useRef(null);

  const handleCloseModal = () => setShowModal(false);

  const handleShowModal = () => {
    setShowModal(prevShowModal => !prevShowModal);
    const iconBounds = iconRef.current.getBoundingClientRect();
    setModalPosition({ top: iconBounds.top, left: iconBounds.right + 8 });
  };

  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });


  const handleFileInput = (e) => {
    var fileName= e.target.files[0].name;
    setFile(e.target.files[0]);
    setFileLoaded(true);
    Logout(`Uploading: ${fileName}\n`);
    // set filename
    if (fileName.length > 20) {
      fileName = fileName.substring(0,20) + "...";
    } 
    setSuccessMsg("File Loaded: " + fileName)
  };

  const __handleSign = async (onChain) => {
    if (!file) {
      console.log("Please Select a file");
      setError("Please Select a File!");
      return;
    }

    const reader = new FileReader();

    reader.addEventListener("load", async () => {
      const fileContent = reader.result;
      const fileHash = hash(fileContent);
      Logout("Signing...\n");

      const sig = await signMessage({
        setError: console.log,
        message: fileHash,
        onChain: onChain,
      });

      console.log(sig);
      console.log(sig.address, sig.signature, sig.timestamp);
      const metadata = GenMetadata(sig.address, fileHash, sig.signature, sig.timestamp);
      const zip = new JSZip();
      zip.file(file.name, fileContent);
      zip.file("signature.json", metadata);

      zip.generateAsync({ type: "blob" }).then((content) => {
        FileSaver.saveAs(content, `${file.name}.zip`);
        Logout("Done\n");
        if (onChain) {
          if (!sig.timestamp) {
            setSuccessMsg("Signed Localy (network error)");
          } else {
            console.log("timestamp", sig.timestamp);
            console.log("date", unixToISOString(sig.timestamp));
            setSuccessMsg("Signed at: "+unixToISOString(sig.timestamp));
          }
        } else {
          setSuccessMsg("Succefully signed!");
        }
      });
    });

    reader.readAsText(file);
  };

  const handleSign = async () => {
    __handleSign(false);
  };

  const handleSignNetwork = async () => {
    __handleSign(true);
  };

  const handleClick = () => {
    hiddenFileInput.current.click();
  };

  return (
    <div className="credit-card w-full shadow-lg mx-auto rounded-xl bg-white border border-primary h-70">
      <main className="mt-4 p-2">
          <center>
        <h1 className="text-xl font-semibold text-gray-700" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }} ref={iconRef}>
          Load & Sign <FaInfoCircle className="info-icon" onClick={handleShowModal} style={{ marginLeft: '0.5rem', cursor: 'pointer' }} ref={iconRef} />
        </h1>
          </center>
      </main>
      <div className="mt-2 p-2">
        <input className="file-input" type="file"  ref={hiddenFileInput} id="file-selector" onChange={handleFileInput} style={{display: 'none'}} />
        <button onClick={handleClick} type="submit" className="btn btn-primary bg-green-500 submit-button focus:ring focus:outline-none w-full">
          Upload
        </button>
  			<div className="h-12 m-1">
        <button onClick={handleSign} disabled={!fileLoaded} type="submit" className="btn btn-primary submit-button focus:ring focus:outline-none w-full">
          Sign
        </button>
        </div>
  			<div className="h-12 m-1">
        <button onClick={handleSignNetwork} disabled={!fileLoaded} type="submit" className="btn btn-primary submit-button focus:ring focus:outline-none w-full">
          Sign on Network
        </button>
        </div>
        <div className="h-12 m-1">
          <ErrorMessage message={error} />
          <SuccessMessage message={successMsg} />
        </div>
         {showModal && (
          <div className="modal-popup" onClick={handleCloseModal}>
            <div className="popup-content" style={{ position: 'absolute', top: modalPosition.top, left: modalPosition.left, zIndex: 1, backgroundColor: '#fff', padding: '1rem', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', borderRadius: '0.5rem' }}>
              <p> Load any file that you want to sign using the UPLOAD button. Then you can either sign it only locally the SIGN button (completely free), or using the blockchain network using the "SIGN ON NETWORK" (this will induce a transaction fee). </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
