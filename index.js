var Transaction = require('ethereumjs-tx');
                 
var request = require("request");


var tx = new Transaction();

tx.nonce = 0;
tx.gasPrice = 1000;
tx.gasLimit = 1000000;
tx.value = 0;
tx.data = '0x7f4e616d65526567000000000000000000000000000000000000000000000000003057307f4e616d6552656700000000000000000000000000000000000000000000000000573360455760415160566000396000f20036602259604556330e0f600f5933ff33560f601e5960003356576000335700604158600035560f602b590033560f60365960003356573360003557600035335700';

var privateKey = new Buffer('e331b6d69882b4cb4ea581d88e0b604039a3de5967688d3dcffdd2270c0fd109',
                            'hex');

tx.sign(privateKey);

console.log('Total Amount of wei needed:' + tx.getUpfrontCost().toString());

console.log("base fee, data fee:",tx.getBaseFee().toString(),tx.getDataFee().toString());
console.log("TX valid:",tx.validate());

var serializedTx = tx.serialize();

console.log('---Serialized TX----');
console.log(tx.serialize().toString('hex'));
console.log('--------------------');



request.post("http://178.62.15.250:8545", {
  json: {
    "jsonrpc":"2.0",
    "method":"eth_sendRawTransaction",
    "params":[
      //{data: "0xd46e8dd67c5d32be8d46e8dd67c5d32be8058bb8eb970870f072445675058bb8eb970870f072445675"}
      { data: serializedTx }
    ],
    "id":1
  }
},function(err, res, body){
  console.log(body);
});
