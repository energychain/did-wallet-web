const EthrDID = require("ethr-did").EthrDID;
const ethers = require("ethers");

class JWTBuilder {
  constructor(config) {
    if((typeof config == 'undefined') || (config == null)) { config = {}; }
    if(typeof config.rpcUrl == 'undefined') config.rpcUrl  = "https://rpc.tydids.com/";
    if(typeof config.name == 'undefined') config.name = "mainnet";
    if(typeof config.chainId == 'undefined') config.chainId = "6226";
    if(typeof config.identifier == 'undefined') config.identifier = "0x0292c844af71ae69ec7cb67b37462ced2fea4277ba8174754013f4311367e78ea4";
    if(typeof config.registry == 'undefined') config.registry ="0xaC2DDf7488C1C2Dd1f8FFE36e207D8Fb96cF2fFB";

    this.config = config
    const parent = this;

    this.getEtherDid = async function(identity)  {
        if ((typeof window !== 'undefined') && (typeof window.ethereum !== 'undefined')) {
            const chainId = await window.ethereum.request({ method: 'eth_chainId'});
            if((chainId !== config.chainId)&&(chainId * 1 !== parseInt(config.chainId, 16) )&&( parseInt(chainId,16) !== config.chainId * 1 )) throw new Error("Web3 Provier - chainID !== "+config.chainId);
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const txSigner = provider.getSigner();
            return new EthrDID({identifier:identity,chainNameOrId:config.chainId,registry:config.registry,provider:provider,txSigner:txSigner});
        } else {
            return new EthrDID({identifier:identity,chainNameOrId:config.chainId,registry:config.registry,rpcUrl:config.rpcUrl,privateKey:config.identity.privateKey});
        }
    }

    this.toJWT = async function(object,identity) {
      if((typeof object !== 'object')||(object == null)) {
        throw new Error('toJWT expects object');
      }
      if((typeof identity == 'undefined')||(identity == null)) {
        identity = config.identity.address;
      }
      const ethrDid = await parent.getEtherDid(identity);
      return await ethrDid.signJWT(object);
    }
  }
}
module.exports = JWTBuilder;
