'use strict';

/**
 * Internal utilities for signing data packets
**/

const querystring = require('querystring');

const utilities   = require('./utilities');
const crypto      = require('crypto');

class Signer {

  static signHash(hash, secretKey) {
    const  text = this.hashToString(hash);
    let    hmac = crypto.createHmac('sha256', secretKey);
    return hmac.update(text).digest('hex');
  }

  // Turns hash into a url style list
  // Not using querystring.stringify because it needs to be sorted and filtered
  static hashToString(hash) {
    const  keys      = Object.getOwnPropertyNames(hash);
    const  validKeys = keys.filter( key => utilities.isNotEmpty(hash[key]) );
    const  params    = validKeys.sort().map( key => `${key}=${querystring.escape(hash[key])}` );
    return params.join('&');
  }

  static stringToHash(string) {
    if (!string)
      return null;

    const params = string.split('&');
    return params.reduce( (hash, param) => {
      const [key, value] = param.split('=');
      hash[key] = querystring.unescape(value);
      return hash;
    }, {});
  }

}

module.exports = Signer;