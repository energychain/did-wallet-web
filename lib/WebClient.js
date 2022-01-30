const JWTBuilder = require("./JWTBuilder.js");
const JWTResolver = require("./JWTResolver.js");
const Identity = require("./Identity.js");
const JWTDecode = require('jsontokens').decodeToken;

const WebClient = {
  JWTBuilder:JWTBuilder,
  JWTResolver:JWTResolver,
  JWTDecode:JWTDecode,
  Identity:Identity,
  connectMetamask:async function() {
    if ((typeof window !== 'undefined') && (typeof window.ethereum !== 'undefined')) {
      let accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      if(accounts.length > 0) {
        window.location.reload();
      }
    }
  }
}
module.exports=WebClient
