import MetaMaskOnboarding from '@metamask/onboarding'
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import styles from "./App.css";

export default function LogArea() {
  const clearLog = async () => {
     document.getElementById("logarea").value = "";

  }
	return (
      <div>
        <div>
          <center> <label> Log </label> </center>
        </div>
        <div className="flex flex-wrap">
          <div className="w-full lg:w-10/12">
            <textarea id="logarea" className="w-full border h-24">
            </textarea>
          </div>
          <div className="w-full lg:w-2/12 flex bottom justify-center items-center bottom">
            <button id="clearlog"  type="submit" className="btn btn-primary submit-button focus:ring focus:outline-none w-full w-64 h-24" onClick={clearLog}>
              Clear Log
            </button>
          </div>
        </div>
      </div>

	)
}
