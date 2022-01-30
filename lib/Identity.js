const ethers = require("ethers");
const EthrDID = require("ethr-did").EthrDID;


class Identity {
  constructor(config) {
    if((typeof config == 'undefined') || (config == null)) config = {};

    if(typeof config.rpcUrl == 'undefined') config.rpcUrl  = "https://rpc.tydids.com/";
    if(typeof config.name == 'undefined') config.name = "mainnet";
    if(typeof config.chainId == 'undefined') config.chainId = "6226";
    if(typeof config.registry == 'undefined') config.registry ="0xaC2DDf7488C1C2Dd1f8FFE36e207D8Fb96cF2fFB";

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

    this.getProvider = async function() {
      if ((typeof window !== 'undefined') && (typeof window.ethereum !== 'undefined')) {
          const chainId = await window.ethereum.request({ method: 'eth_chainId'});
          if(chainId !== config.chainId) throw new Error("Web3 Provier - chainID !== "+config.chainId);
          return new ethers.providers.Web3Provider(window.ethereum)
      } else {
          return new ethers.providers.JsonRpcProvider(config.rpcUrl);
      }
    }

    this.getBalance = async function(address) {
      if((typeof address == 'undefined') || (address == null)) {
        address = parent.config.identity.address;
      }
      const provider = await parent.getProvider();
      return await ethers.utils.formatUnits(await provider.getBalance(address),'finney');
    }

    this.delegate = async function(id,to,duration) {
        if((typeof duration == 'undefined')||(duration==null)) duration = 3600;
        const provider = await parent.getProvider();
        const wallet = new ethers.Wallet(config.identity.privateKey,provider);
        const registry = new ethers.Contract( config.registry , config.abi , wallet );
        return await registry.addDelegate(id,"0x766572694b657900000000000000000000000000000000000000000000000000",to,duration);
    }

    this.revokeDelegate = async function(id,to) {
      const provider = await parent.getProvider();
      const wallet = new ethers.Wallet(config.identity.privateKey,provider);
      const registry = new ethers.Contract( config.registry , config.abi , wallet );
      return await registry.revokeDelegate(id,"0x766572694b657900000000000000000000000000000000000000000000000000",to);
    }

    this.changeOwner = async function(id,to) {
      const provider = await parent.getProvider();
      const wallet = new ethers.Wallet(config.identity.privateKey,provider);
      const registry = new ethers.Contract( config.registry , config.abi , wallet );
      return await registry.changeOwner(id,to);
    }

    this.resolve = async function(addr) {
      const provider = await parent.getProvider();
      const wallet = new ethers.Wallet(config.identity.privateKey,provider);
      const ethrDid = new EthrDID({txSigner:wallet,provider:provider,identifier:config.identity.identifier,registry:config.registry});
      return await ethrDid.resolve(addr);
    }
  }
}
module.exports = Identity;
