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
    this._updateNonce();
  },
  sendAsync: function(payload, callback){
    var self = this;
    console.log("nonce",this._nonce);
    
    if(payload.method === "eth_sendTransaction"){
      payload.method = "eth_sendRawTransaction";

      var tx = new Tx();

      _.extend(tx, {
        nonce: this._nonce
      }, payload.params[0]);

      tx.sign(this._pk);
      
      payload.params = ['0x' + tx.serialize().toString('hex')];
    }

    console.log("raw payload:", payload);

    HttpProvider.prototype.sendAsync.call(this, payload, function(){
      self._updateNonce();
      callback.apply(null,arguments); 
    });
  },
  _updateNonce: function(){
    this._nonce = parseInt(this.send({
      jsonrpc: "2.0",
      method: "eth_getTransactionCount",
      params: [this._address, "latest"],
      id: 1
    }).result, 16) +2;
  }
  // ,
  // send: function(payload, callback){
  
  // }
});

var privateKey = new Buffer('e331b6d69882b4cb4ea581d88e0b604039a3de5967688d3dcffdd2270c0fd108',
                            'hex');

var address = ethUtils.privateToAddress(privateKey).toString("hex");
console.log(address);

var web3 = new Web3(new RawProvider("http://46.101.91.161:8545", privateKey));
//var web3 = new Web3(new Web3.providers.HttpProvider("http://46.101.91.161:8545"));

//web3.eth.getTransactionCount('0xffa19aeec96ef7b4a41448ba8fec37168edcab63');


web3.eth.sendTransaction({
  from: "0x"+address,
  to:'0xffa19aeec96ef7b4a41448ba8fec37168edcab63',
  value: 100000
}, function(err, res){
  console.log(arguments);
});



