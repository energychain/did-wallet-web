const Resolver = require('did-resolver').Resolver;
const getResolver = require('ethr-did-resolver').getResolver;
const EthrDID = require("ethr-did").EthrDID;

class JWTResolver {
  constructor(config) {
    if((typeof config == 'undefined') || (config == null)) config = {};

    if(typeof config.rpcUrl == 'undefined') config.rpcUrl  = "https://integration.corrently.io/";
    if(typeof config.name == 'undefined') config.name = "mainnet";
    if(typeof config.chainId == 'undefined') config.chainId = "6226";
    if(typeof config.identifier == 'undefined') config.identifier = "0x0292c844af71ae69ec7cb67b37462ced2fea4277ba8174754013f4311367e78ea4";
    if(typeof config.registry == 'undefined') config.registry ="0xda77BEeb5002e10be2F5B63E81Ce8cA8286D4335";
    if(typeof config.identity == 'undefined') {
      const Identity = require("./Identity.js");
      const identity = new Identity(config);
      config.identity = identity.getIdentity();
    }
    this.toDid = async function(jwt) {
      if((typeof jwt !== 'string') || (jwt.substr(0,2) !== 'ey')) {
          throw new Error('JWT expected received: '+jwt);
      }
      const didResolver = new Resolver(getResolver(config));
      const ethrDid = new EthrDID(config);
      const did = await ethrDid.verifyJWT(jwt, didResolver);
      return did;
    }
    this.resolve = async function(addr) {
      const didResolver = new Resolver(getResolver(config));
      return await didResolver.resolve(addr);
    }
  }
}
module.exports = JWTResolver;
