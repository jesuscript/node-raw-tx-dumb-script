var Tx = require('ethereumjs-tx'),
    BN = require('bn.js'),
    _ = require("lodash"),
    ethUtils = require("ethereumjs-util"),
    Web3 = require("web3");


var HttpProvider = Web3.providers.HttpProvider;

var RawProvider = function(host, pk){
  if(!pk) throw new Error("Private key must be provided");
  
  HttpProvider.call(this, host);

  this._address = ethUtils.privateToAddress(pk).toString("hex");

  this.setPrivateKey(pk);
};

RawProvider.prototype = _.extend({}, HttpProvider.prototype, {
  setPrivateKey: function(pk){
    this._pk = pk;
  },
  sendAsync: function(payload, callback){
    var self = this;

    //console.log("old payload:", payload);
    
    if(payload.method === "eth_sendTransaction"){
      var tx = {},
          params = payload.params[0];

      tx.to = params.to;
      tx.gasLimit = params.gasLimit;
      tx.value = params.value;

      tx.nonce = parseInt(this.send({
        jsonrpc: "2.0",
        method: "eth_getTransactionCount",
        params: [this._address, "pending"],
        id: 1
      }).result);

      //console.log("fake tx RAW", tx);

      tx = _.extend(new Tx(), tx);

      tx.sign(this._pk);

      console.log("raw signed tx:", tx.serialize().toString('hex'));
      
      var newPayload = {
        jsonrpc: "2.0",
        method: "eth_sendRawTransaction",
        id: payload.id,
        params: ['0x' + tx.serialize().toString('hex')]
      };

      //console.log("new payload", newPayload);
    }

    HttpProvider.prototype.sendAsync.call(this, newPayload, function(){
      callback.apply(null,arguments); 
    });
  }
  // ,
  // send: function(payload, callback){
  
  // }
});

var pk = new Buffer('e331b6d69882b4cb4ea581d88e0b604039a3de5967688d3dcffdd2270c0fd109',
                    'hex');

var address = ethUtils.privateToAddress(pk).toString("hex");
console.log(address);

var ip = "46.101.82.71";

var web3_1 = new Web3(new RawProvider("http://" + ip + ":8545", pk));
var web3_2 = new Web3(new Web3.providers.HttpProvider("http://"+ip+":8545"));

//web3.eth.getTransactionCount('0xffa19aeec96ef7b4a41448ba8fec37168edcab63');


web3_1.eth.sendTransaction({
  from: "0x"+address,
  to:'0xffa19aeec96ef7b4a41448ba8fec37168edcab63',
  value: 100000,
  gasLimit: 1000000
}, function(err, res){
  if(err) throw err;
  console.log("res:", res);
  console.log("RawProvider result:",web3_1.eth.getTransaction(res));
});

// VVVV working code VVVV

// var sendAmount  = 1000000;//amount to send

// var hexBal = '0' + sendAmount.toString(16);

// var tx = {};
// tx.to = '0xffa19aeec96ef7b4a41448ba8fec37168edcab63';
// tx.gasLimit = 1000000;
// tx.value = '0x186a0';//1000000;
// tx.nonce = web3_2.eth.getTransactionCount(address);


// console.log("fake tx http:", tx);

// tx = _.extend(new Tx(), tx);
// tx.sign(pk);

// console.log("http signed tx", tx.serialize().toString('hex'));

// web3_2.eth.sendRawTransaction('0x' + tx.serialize().toString('hex'), function (err, r) {
//   if(err) throw err;
//   console.log(r);

//   console.log("HttpProvider result:",web3_2.eth.getTransaction(r));
// });


