import Wallet from "./Wallet";
import Transfer from "./Transfer";
import "./App.scss";
import { useState } from "react";

function App() {
  const [balance, setBalance] = useState(0);
  const [address, setAddress] = useState("");
  const [privatekey, setPrivateKey] = useState("");

  return (
    <div className="app">
      <Wallet
        balance={balance}
        setBalance={setBalance}
        setPrivateKey={setPrivateKey}
        address={address}
        setAddress={setAddress}
      />
      <Transfer setBalance={setBalance}  address={address} privateKey={privatekey} />
    </div>
  );
}

export default App;
