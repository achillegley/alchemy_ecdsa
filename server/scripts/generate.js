const {secp256k1} = require("ethereum-cryptography/secp256k1");
const { toHex } = require("ethereum-cryptography/utils");

//generate private key
const privatekey= secp256k1.utils.randomPrivateKey();

console.log('private key', toHex(privatekey));

const publickey= secp256k1.getPublicKey(privatekey);
console.log('public key', toHex(publickey));