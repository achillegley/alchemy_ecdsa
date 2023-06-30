const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;

const {secp256k1} = require("ethereum-cryptography/secp256k1");
const { keccak256 }= require("ethereum-cryptography/keccak");
const { toHex } = require("ethereum-cryptography/utils");

app.use(cors());
app.use(express.json());

const balances = {
  "027f71345479efbe62ec7ab48ee9e6fbfb41d5b5b074fae3f9ba90c7d3fb5a1670": 100,
  "03207dee50ee007f95ef25179bf76f9da804d970daaf12ceeaa5c3370cc595448b": 50,
  "03bde3261a1f9666ae5a67c150d54b9a08bf8b7c80e34bb7c45444e33093fe7844": 75,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});
/*
ask the user what is the privatekey so that sign the message and send to server
passing a signature rather done a wallet address this is the sender
*/ 


app.post("/send", (req, res) => {
  //get signature from the client-side application
  //recover the public address from the sgnature
  
  const { message, signature } = req.body;

  const messageHash = toHex(keccak256(Uint8Array.from(message)));
  sender=message.sender;
  recipient=message.recipient;
  amount=message.amount;
 

  //let's first check the signature
  const isSigner = secp256k1.verify(signature, messageHash, sender);

  if(isSigner){
    setInitialBalance(sender);
    setInitialBalance(recipient);

    if (balances[sender] < amount) {
      res.status(400).send({ message: "Not enough funds!" });
    } else {
      balances[sender] -= amount;
      balances[recipient] += amount;
      res.send({ balance: balances[sender] });
    }
  }else {
    res.status(400).send({ message: "you are not the signer!" });
  }
  
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
