import { useState, useRef } from "react";
import { ethers } from "ethers";
import ErrorMessage from "./ErrorMessage";
import SuccessMessage from "./SuccessMessage";
import JSZip from 'jszip';
import FileSaver from 'file-saver';

const verifyMessage = async ({ message, address, signature }) => {
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
	console.log("File handling");
	const verifyfilestatus = document.getElementById('verifyfilestatus');
	verifyfilestatus.textContent = "Loaded file size is: "+file.size;
	fileblob = file;
	//verifyfilestatus.textContent = 'Error: The File.type property does not appear to be supported on this browser.';
    }

  const handleVerification = async (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    setSuccessMsg();
    setError();

	var zip = new JSZip();
	zip.loadAsync(fileblob)
	.then(async function (zip) {
	    var zfiles = zip.files;
	    var fileSignature = "signature.txt";
	    var fileDoc = "";
	    var fileAddr = "address.txt";
	    if (zip.files.length != 3) {
		console.log("there is more or less (" + zip.files.length + ") than 3 files");
	    }
	    // TODO check that fileSignature and fileAddr exists
	    console.log(zfiles);
	    //console.log(zfiles[1].name);
	    //console.log(zfiles[0].indexOf(fileSignature));
	    //console.log(beasts.indexOf(fileAddr));
	    zip.forEach((relPath, file) => {
		console.log(relPath);
	        if (relPath != fileAddr  && relPath != fileSignature) {
			fileDoc = relPath;
       		}
      	    });

	    var doc = 'doc';
	    var addr = 'add';
	    var signature = 'sig';
	    signature = await zip.file(fileSignature).async("text");
	    doc = await zip.file(fileDoc).async("text");
	    addr = await zip.file(fileAddr).async("text");
	    //var addr = await zip.file(fileAddr).async("string");
	    //var signature = await zip.file(fileSignature).async("string");
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
	console.log("Signature is valid!!!")
     
    } else {
      setError("Invalid signature");
      console.log("Invalid signature");
    }

  	    //const reader = new FileReaderSync();
  	    //reader.addEventListener('load', handleFile);
  	    //mainFileContent = reader.readAsText(zip.files[0]);
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
    		<input className="textarea w-full h-24 textarea-bordered focus:ring focus:outline-none" type="file" id="file-selector" onChange={handleFileInputVerify} />
    		<p id="verifyfilestatus"></p>
            </div>
            <div className="my-3">
              <textarea
                type="text"
                name="signature"
                className="textarea w-full h-24 textarea-bordered focus:ring focus:outline-none"
                placeholder="Signature"
              />
            </div>
            <div className="my-3">
              <input
                type="text"
                name="address"
                className="textarea w-full input input-bordered focus:ring focus:outline-none"
                placeholder="Signer address"
              />
            </div>
          </div>
        </main>
        <footer className="p-4">
          <button
            type="submit"
            className="btn btn-primary submit-button focus:ring focus:outline-none w-full"
          >
            Verify signature
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
