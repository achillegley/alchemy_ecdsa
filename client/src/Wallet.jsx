import server from "./server";
import  {secp256k1} from "ethereum-cryptography/secp256k1";
import  {toHex} from "ethereum-cryptography/utils";


function Wallet({ address, setAddress, balance, setBalance, privatekey, setPrivateKey }) {
  async function onChange(evt) {
    const privatekey = evt.target.value;
    setPrivateKey(privatekey);
    //get address from private key
    const address= toHex(secp256k1.getPublicKey(privatekey));
    setAddress(address);
    if (address) {
      const {
        data: { balance },
      } = await server.get(`balance/${address}`);
      setBalance(balance);
    } else {
      setBalance(0);
    }
  }

  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>

      <label>
        Private key
        <input placeholder="Type an a private key" value={privatekey} onChange={onChange}></input>
      </label>
      <div>
        Address: {address.slice(0,10)}...
      </div>
      <div className="balance">Balance: {balance}</div>
    </div>
  );
}

export default Wallet;
