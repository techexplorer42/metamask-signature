import React, { useState, useRef } from "react";
import { ethers } from "ethers";
import ErrorMessage from "./ErrorMessage";
import GenMetadata from "./Metadata";
import JSZip from "jszip";
import FileSaver from "file-saver";
import styles from "./App.css";
import { createHash } from "crypto";

const hash = (string) => createHash("sha256").update(string).digest("hex");

const signMessage = async ({ setError, message }) => {
  try {
    console.log({ message });
    if (!window.ethereum) throw new Error("No crypto wallet found. Please install it.");

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

    return { message, signature, address };
  } catch (err) {
    setError(err.message);
  }
};

export default function SignMessage() {
  const [error, setError] = useState();
  const [file, setFile] = useState();
  const hiddenFileInput = useRef(null);

  const handleFileInput = (e) => {
    const logarea = document.getElementById("logarea");
    setFile(e.target.files[0]);
    logarea.value += `Uploading: ${e.target.files[0].name}\n`;
  };

  const handleSign = async () => {
    if (!file) {
      console.log("Please Select a file");
      return;
    }

    const logarea = document.getElementById("logarea");
    const reader = new FileReader();

    reader.addEventListener("load", async () => {
      const fileContent = reader.result;
      const fileHash = hash(fileContent);
      logarea.value += "Signing...";

      const sig = await signMessage({
        setError: console.log,
        message: fileHash,
      });

      const metadata = GenMetadata(sig.address, sig.signature);
      const zip = new JSZip();
      zip.file(file.name, fileContent);
      zip.file("signature.json", metadata);

      zip.generateAsync({ type: "blob" }).then((content) => {
        FileSaver.saveAs(content, `${file.name}.zip`);
        logarea.value += "Done\n";
      });
    });

    reader.readAsText(file);
  };

  const handleClick = () => {
    hiddenFileInput.current.click();
  };

  return (
    <div className="credit-card w-full shadow-lg mx-auto rounded-xl bg-white border border-primary h-56">
      <main className="mt-4 p-4">
        <h1 className="text-xl font-semibold text-gray-700 text-center">
          Load & Sign
        </h1>
      </main>
      <div className="mt-2 p-2">
        <input className="file-input" type="file"  ref={hiddenFileInput} id="file-selector" onChange={handleFileInput} style={{display: 'none'}} />
        <button onClick={handleClick} type="submit" className="btn btn-primary bg-green-500 submit-button focus:ring focus:outline-none w-full">
          Upload
        </button>
        <p id="filename"> </p>
      </div>
      <div className="mt-2 p-2">
        <button onClick={handleSign} type="submit" className="btn btn-primary submit-button focus:ring focus:outline-none w-full">
          Sign
        </button>
      </div>
    </div>
  );
}
