const ethers = require("ethers");
const EthrDID = require("ethr-did").EthrDID;


class Identity {
  constructor(config) {
    if((typeof config == 'undefined') || (config == null)) config = {};

    if(typeof config.rpcUrl == 'undefined') config.rpcUrl  = "https://integration.corrently.io/";
    if(typeof config.name == 'undefined') config.name = "mainnet";
    if(typeof config.chainId == 'undefined') config.chainId = "6226";
    if(typeof config.registry == 'undefined') config.registry ="0xda77BEeb5002e10be2F5B63E81Ce8cA8286D4335";

    config.abi = require("../EthereumDIDRegistry.abi.json");

    if(typeof config.privateKey == 'undefined') {
      config.identity = EthrDID.createKeyPair();
    } else {
      config.identity = {
        address:config.address,
        privateKey:config.privateKey,
        publicKey:config.publicKey,
        identifier:config.identifier
      }
    }
    const parent = this;
    parent.config = config;

    this.getIdentity = function() {
      const identity = EthrDID.createKeyPair();
      parent.identity = identity;
      return identity;
    }

    this.delegate = async function(id,to,duration) {
        if((typeof duration == 'undefined')||(duration==null)) duration = 3600;
        const provider = new ethers.providers.JsonRpcProvider(config.rpcUrl);
        const wallet = new ethers.Wallet(config.identity.privateKey,provider);
        const registry = new ethers.Contract( config.registry , config.abi , wallet );
        return await registry.addDelegate(id,"0x766572694b657900000000000000000000000000000000000000000000000000",to,duration);
    }

    this.revokeDelegate = async function(id,to) {
      const provider = new ethers.providers.JsonRpcProvider(config.rpcUrl);
      const wallet = new ethers.Wallet(config.identity.privateKey,provider);
      const registry = new ethers.Contract( config.registry , config.abi , wallet );
      return await registry.revokeDelegate(id,"0x766572694b657900000000000000000000000000000000000000000000000000",to);
    }

    this.changeOwner = async function(id,to) {
      const provider = new ethers.providers.JsonRpcProvider(config.rpcUrl);
      const wallet = new ethers.Wallet(config.identity.privateKey,provider);
      const registry = new ethers.Contract( config.registry , config.abi , wallet );
       await registry.addDelegate(id,"0x766572694b657900000000000000000000000000000000000000000000000000",to,3600);
      return {};
    }

    this.resolve = async function(addr) {
      const provider = new ethers.providers.JsonRpcProvider(config.rpcUrl);
      const wallet = new ethers.Wallet(config.identity.privateKey,provider);
      const ethrDid = new EthrDID({txSigner:wallet,provider:provider,identifier:config.identity.identifier,registry:config.registry});
      return await ethrDid.resolve(addr);
    }
  }
}
module.exports = Identity;
