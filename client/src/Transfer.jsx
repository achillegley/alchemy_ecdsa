import { useState } from "react";
import server from "./server";
import  {secp256k1} from "ethereum-cryptography/secp256k1";
import { keccak256 } from "ethereum-cryptography/keccak";
import  { toHex } from "ethereum-cryptography/utils";

function Transfer({ address, setBalance , privateKey}) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");

  const getSignatureArray=(signature)=>{
    // Convert the Signature object to a Uint8Array
    const rBytes = bigIntToUint8Array(signature.r);
    const sBytes = bigIntToUint8Array(signature.s);
    const signatureBytes = concatenateArrays(rBytes, sBytes);

    return signatureBytes;
  }

  const setValue = (setter) => (evt) => setter(evt.target.value);
  //const hashMessage = (message) => keccak256(Uint8Array.from(message));
  const  createSignature=async (message)=>{
    const messageHash = toHex(keccak256(Uint8Array.from(message)));
    const signature= await secp256k1.sign(messageHash,privateKey);
    return signature;
  }

  function concatenateArrays(arr1, arr2) {
    const combinedArray = new Uint8Array(arr1.length + arr2.length);
    combinedArray.set(arr1);
    combinedArray.set(arr2, arr1.length);
    return combinedArray;
  }

  function bigIntToUint8Array(value) {
    const hexString = value.toString(16);
    const byteLength = Math.ceil(hexString.length / 2);
    const byteArray = new Uint8Array(byteLength);
  
    let byteIndex = 0;
    let hexIndex = 0;
  
    while (hexIndex < hexString.length) {
      const hexByte = hexString.substr(hexIndex, 2);
      byteArray[byteIndex] = parseInt(hexByte, 16);
      byteIndex++;
      hexIndex += 2;
    }
  
    return byteArray;
  }
  
  async function transfer(evt) {
    evt.preventDefault();
    const message = {
      sender:address,
      amount: parseInt(sendAmount),
      recipient:recipient
    };
    const signature=await createSignature(message);
    
    try {
      const {
        data: { balance },
      } = await server.post(`send`, {
        message:message,
        signature:toHex(getSignatureArray(signature))//convert the result toHex
      });
      setBalance(balance);
    } catch (ex) {
      //console.log(ex);
      alert(ex.response.data.message);
    }
  }

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

      <label>
        Recipient
        <input
          placeholder="Type an address, for example: 0x2"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>

      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;
