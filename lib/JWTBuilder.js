const EthrDID = require("ethr-did").EthrDID;

class JWTBuilder {
  constructor(config) {
    if((typeof config == 'undefined') || (config == null)) { config = {}; }
    if(typeof config.rpcUrl == 'undefined') config.rpcUrl  = "https://rpc.tydids.com/";
    if(typeof config.name == 'undefined') config.name = "mainnet";
    if(typeof config.chainId == 'undefined') config.chainId = "6226";
    if(typeof config.identifier == 'undefined') config.identifier = "0x0292c844af71ae69ec7cb67b37462ced2fea4277ba8174754013f4311367e78ea4";
    if(typeof config.registry == 'undefined') config.registry ="0xaC2DDf7488C1C2Dd1f8FFE36e207D8Fb96cF2fFB";

    this.config = config;

    this.toJWT = async function(object,identity) {
      if((typeof object !== 'object')||(object == null)) {
        throw new Error('toJWT expects object');
      }
      if((typeof identity == 'undefined')||(identity == null)) {
        identity = config.identity.address;
      }
      const ethrDid = new EthrDID({identifier:identity,chainNameOrId:config.chainId,registry:config.registry,rpcUrl:config.rpcUrl,privateKey:config.identity.privateKey});
      return await ethrDid.signJWT(object);
    }
  }
}
module.exports = JWTBuilder;
