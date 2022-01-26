const EthrDID = require("ethr-did").EthrDID;

class JWTBuilder {
  constructor(config) {
    if((typeof config == 'undefined') || (config == null)) { config = {}; }
    if(typeof config.rpcUrl == 'undefined') config.rpcUrl  = "https://integration.corrently.io/";
    if(typeof config.name == 'undefined') config.name = "mainnet";
    if(typeof config.chainId == 'undefined') config.chainId = "6226";
    if(typeof config.identifier == 'undefined') config.identifier = "0x0292c844af71ae69ec7cb67b37462ced2fea4277ba8174754013f4311367e78ea4";
    if(typeof config.registry == 'undefined') config.registry ="0xda77BEeb5002e10be2F5B63E81Ce8cA8286D4335";

    this.config = config;

    this.toJWT = async function(object,identity) {
      if((typeof object !== 'object')||(object == null)) {
        throw new Error('toJWT expects object');
      }
      if((typeof identity == 'undefined')||(identity == null)) {
        identity = config.identity.publicKey;
      }
      const ethrDid = new EthrDID({identifier:identity,chainNameOrId:config.chainId,registry:config.registry,rpcUrl:config.rpcUrl,privateKey:config.identity.privateKey});
      return await ethrDid.signJWT(object);
    }
  }
}
module.exports = JWTBuilder;
