import Web3 from 'web3';
import { ethers } from "ethers";
import contractABI from './contractABI';
import { unixToISOString } from './Utils';

//const web3 = new Web3('https://polygon-mainnet.g.alchemy.com/v2/jgGAKLkYRn-CdqR1XYB8xyFLAegjuhYv');
const web3 = new Web3('https://polygon-mumbai.g.alchemy.com/v2/D8SHtFeKK8iHMNagJgsrL4Y5GT9sUT8v');
const contractAddress = '0xaC2f2741DeD884e77b60e6823Da1534F28DEfBfC';
const contractInstance = new web3.eth.Contract(contractABI, contractAddress);

function isBytes32(value) {
  const bytes32Regex = /^0x[a-fA-F0-9]{64}$/;
  return typeof value === 'string' && bytes32Regex.test(value);
}


export const checkIfSigned = async (address, hash) => {
  try {
    const bytes32Hash = "0x" + hash;
    const result = await contractInstance.methods.hasSigned(bytes32Hash, address).call();
    console.log("result", result);
    if (!result) {
      console.log("result returning", result);
      return false;
    }
    console.log("result type", typeof(result));
    if (result == 0 || result == '0') {
      console.log("result returning... 0", result);
      return false;
    } else {
      const block = await web3.eth.getBlock(result);
      console.log("block", block);
      const timestamp = block.timestamp;
      console.log("timestamp", timestamp);
      console.log("timestamp * 1000", unixToISOString(timestamp));
      return unixToISOString(timestamp);
    }
  } catch (error) {
    console.log(error);
    return false; // something went wrong, return null
  }
};


/*
const getTransactionReceipt = async (txHash) => {
  let receipt = await web3.eth.getTransactionReceipt(txHash);
  while (!receipt) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    receipt = await web3.eth.getTransactionReceipt(txHash);
    console.log("waiting for receipt...", receipt);
  }
  return receipt;
};*/

const getTransactionReceipt = async (txHash) => {
  let receipt = await web3.eth.getTransactionReceipt(txHash);
  let timeout;
  let timeoutMs=1000*30; //10 seconds

  const receiptPromise = new Promise((resolve, reject) => {
    timeout = setTimeout(() => {
      clearTimeout(timeout);
      reject(`Timeout of ${timeoutMs}ms exceeded while waiting for transaction receipt`);
    }, timeoutMs);
  });

  while (!receipt) {
    await Promise.race([receiptPromise, new Promise(resolve => setTimeout(resolve, 1000))]);
    receipt = await web3.eth.getTransactionReceipt(txHash);
    console.log("waiting for receipt...", receipt);
  }

  clearTimeout(timeout);
  return receipt;
};

export const signDocument = async (address, hash) => {
  try {
    const bytes32Hash = "0x" + hash;

    if (!window.ethereum) 
      throw new Error("No crypto wallet found. Please install it.");

    // get the gas limit for the transaction
    const block = await web3.eth.getBlock("latest");
    const gasLimit = Math.round(block.gasLimit / block.transactions.length);
    console.log("hash", hash);

    // create the transaction object
    const txObject = {
      from: address,
      to: contractAddress,
      value: web3.utils.toHex(web3.utils.toWei('0', 'ether')),
      gas: "31000",
      gasPrice: web3.utils.toHex(web3.utils.toWei('10', 'gwei')),
      data: contractInstance.methods.signDocument(bytes32Hash).encodeABI()
    };
    console.log("txObject", txObject);

    //const tx = { gas: gasLimit, to: contractInstance._address, data: contractInstance.methods.signDocument(bytes32Hash).encodeABI(), };

    console.log("address", address);
    // popup - request the user to sign and broadcast the transaction
    const txHash = await ethereum.request({
        method: 'eth_sendTransaction',
        params: [txObject],
    });
    console.log("txHash", txHash);

    // Get transaction receipt
    const receipt = await getTransactionReceipt(txHash);
    if (!receipt) {
      const msg = "Could not confirm transaction";
      const logarea = document.getElementById("logarea");
      logarea.value += msg;
      console.log(msg);
      alert(msg);
      return null;
    }

    const blockNumber = receipt.blockNumber;
    const timestamp = (await web3.eth.getBlock(blockNumber)).timestamp;
    console.log(`Document signed at block number ${blockNumber} and timestamp ${unixToISOString(timestamp)}`);
    return timestamp;

  } catch (error) {
    alert(`Error signing document: ${error.message}`);
    console.log(error);
    return false;
  }
};

