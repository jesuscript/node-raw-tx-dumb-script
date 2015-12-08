var Tx = require('ethereumjs-tx'),
    BN = require('bn.js'),
    ethUtils = require("ethereumjs-util"),
    Web3 = require("web3");



var web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider('http://46.101.74.242:8545'));

console.log("block:", web3.eth.getBlock("latest"));

var privateKey = new Buffer('e331b6d69882b4cb4ea581d88e0b604039a3de5967688d3dcffdd2270c0fd109',
                            'hex');
var address = ethUtils.privateToAddress(privateKey).toString("hex");

var sendAmount  = 100000,
    hexAmt = '0' + sendAmount.toString(16);



console.log("address:",address);
console.log("balance:", web3.fromWei(web3.eth.getBalance("0x"+address).toString(), "ether"), "ether");
console.log("hexAmt:", hexAmt);

var tx = new Tx();
tx.to = '0xffa19aeec96ef7b4a41448ba8fec37168edcab63';
tx.gasPrice = '0x' + web3.eth.gasPrice.toString(16);
tx.gasLimit = 21000;
tx.nonce = "0x007";

tx.value = new BN(new Buffer(hexAmt, 'hex')).add(tx.getUpfrontCost());
tx.sign(privateKey);

web3.eth.sendRawTransaction('0x' + tx.serialize().toString('hex'), function (err, r) {
  console.log(err);
  console.log(r);
});
